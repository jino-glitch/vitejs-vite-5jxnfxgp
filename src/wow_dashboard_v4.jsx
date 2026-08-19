"""
MASTER REBUILD SCRIPT — run this every time FY2026_Sprouts.xlsx is updated
Rebuilds ALL constants in one pass: DATA26, DATA25, SPARK_DATA,
STORE_OUTBOUND, STORE_CAT_UNITS, STORE_DATA, DELIVERY_MATRIX

DELIVERY_MATRIX authority model:
  1. FY2026_Sprouts.xlsx outbound column — always used as base (values are in cases)
  2. DC template (Google Drive preferred, chat upload fallback) — optional override
     When DC template is present, it overwrites matching store entries in STORE_OUTBOUND,
     then DELIVERY_MATRIX is re-aggregated from the corrected STORE_OUTBOUND.
     All overwrites are logged to console.

DC TEMPLATE SOURCE PRIORITY:
  1. Google Drive — pull via Drive MCP using file IDs in DRIVE_TEMPLATE_IDS
  2. /mnt/user-data/uploads/ — fallback if Drive not available
  Script auto-detects any *DC_TEMPLATE*.xlsx glob from uploads as fallback.
  Skips FWs already present in CORRECTIONS_LOG (no double-applying).
  Corrections are baked into STORE_OUTBOUND and CORRECTIONS_LOG permanently.

DRIVE_TEMPLATE_IDS — extend this dict as new weeks arrive:
  WK15: 1uoljy6FXO2n0miZRC8VrcmvXpyrwgzPT  (applied)
  WK16: 1xIvLUfpof3HexWvpZs8ZU9bse2X3TxZ4  (applied)
  WK17: 1tmx5izb52jd1XyVlwoNC435MsmqOxwop  (skipped — corrupt 16KB)
  WK18: 1lKHunqTizONfeLVgS0IhyYbChyO_h1uH  (applied)
  WK19: 1spgwW8yybt_FgTDYzF7kj4bJI_pCduNk  (applied)
"""
import pandas as pd, json, re, glob, os, tempfile

JSX_PATH = '/home/claude/work/wow_dashboard_v4.jsx'
FY26_PATH = '/home/claude/work/FY2026_Sprouts.xlsx'
FY25_PATH = '/home/claude/work/FY2025_Sprouts.xlsx'

PROD_FILTER = 'ORCHID|BAMBOO|FUSED|LAVENDER'

# Google Drive file IDs for DC templates — extend as new weeks arrive
# Set drive_id to None to skip that week from Drive (will still check uploads)
DRIVE_TEMPLATE_IDS = {
    15: '1uoljy6FXO2n0miZRC8VrcmvXpyrwgzPT',  # WK15 — applied
    16: '1xIvLUfpof3HexWvpZs8ZU9bse2X3TxZ4',  # WK16 — applied
    17: None,                                    # WK17 — corrupt, skip
    18: '1lKHunqTizONfeLVgS0IhyYbChyO_h1uH',  # WK18 — applied
    19: '1spgwW8yybt_FgTDYzF7kj4bJI_pCduNk',  # WK19 — applied
    20: '1uTRsTbUIKHvXXfQiYt45UM9wUicRLZQ8',  # WK20 — applied
    21: '1Tk530v0LN81SkMdYQh_AS_NpJkP7pmDu',  # WK21
    22: '1CWueCgNn9NCmP6VauFLNNES5DSobVsAA',  # WK22
}

VENDOR_MAP = {
    'LAVENDER-BUNCH-DRIED': 'VUES',
    'LAVENDER-SACHET': 'VUES',
    'SHIPPER-LAVENDER 90PC DSP': 'VUES',
    'ORCHID-ARRANGEMENT DUO': 'BORING DECO',
    'ORCHID-CASCADE-FUSED': 'BORING DECO',
    'ORCHID-COLOR-EVERYDAY-5 IN': 'BORING DECO',
    'ORCHID-LARGE WHITE': 'BORING DECO',
    'ORCHID-LOOP': 'BORING DECO',
    'ORCHID-SWEETHEART': 'BORING DECO',
    'PLANT-5-ORCHID': 'BORING DECO',
    'PLANT-FOOD': 'BORING DECO',
    'PLANT-ORCHID-CASCADE-PREMIUM': 'BORING DECO',
    'PLANT-ORCHID-FUSED': 'BORING DECO',
    'PLANT-ORCHID-SMALL': 'BORING DECO',
    'BAMBOO-STONE': 'BORING DECO',
    'ORCHID-BIG HEART': 'BORING DECO',
    'ORCHID-TEACUP-3"': 'BORING DECO',
    'ORCHID-CASCADE': 'CYMA',
    'ORCHID-DENDRONBIUM-NOBILE': 'UNKNOWN',
    'ORCHID-FUSED-COLORED': 'UNKNOWN',
    'ORCHID-PLANT': 'UNKNOWN',
    'PLANT-ORCHID': 'UNKNOWN',
    'ORCHID-MINI STADIUM-2.5IN': 'GREEN CIRCLE',
    'ORCHID-PETITE GARDEN- 5IN': 'GREEN CIRCLE',
    'ORCHID-PREMIUM-CERAMIC': 'GREEN CIRCLE',
    'ORCHID-SMALL': 'GREEN CIRCLE',
    'ORCHID-WATERCOLOR': 'GREEN CIRCLE',
    'ORCHID-WATERFALL-PREMIUM-5IN': 'GREEN CIRCLE',
}

def get_cat(desc):
    d = str(desc).upper()
    if any(x in d for x in ['LAVENDER','BAMBOO','FOOD','SHIPPER']): return None
    if 'FUSED' in d: return 'fused'
    if 'CASCADE' in d or 'WATERFALL' in d: return 'cascades'
    if 'ARRANGEMENT' in d: return 'arrangements'
    if 'MINI' in d or '2.5' in d: return '2inch'
    if 'SMALL' in d or 'TEACUP' in d or '3"' in d: return '3inch'
    return '5inch'

# Internal cat key -> DELIVERY_MATRIX display key
CAT_TO_DM = {
    '5inch': '5in Orchid',
    '2inch': '2in Orchid',
    '3inch': '3in Orchid',
    'fused': '5in Fused',
    'cascades': 'Cascades',
    'arrangements': 'Arrangements',
}

PACK = {'5inch': 10, '3inch': 15, 'fused': 10, 'cascades': 8, 'arrangements': 6, '2inch': 12}
OUT_COL_26 = 'Outbound Ship Quantity by Delivery Date'
OUT_COL_25 = 'Outbound '

SKU_TO_PROD = {
    'DC62042': 'PLANT-5-ORCHID',
    'DC62041': 'PLANT-ORCHID-SMALL',
    'DC62043': 'PLANT-ORCHID-FUSED',
    'DC62047': 'PLANT-ORCHID-CASCADE-PREMIUM',
    'DC62048': 'PLANT-ORCHID-ARRANGEMENT',
}
PROD_TO_CAT = {
    'PLANT-5-ORCHID': '5inch', 'PLANT-ORCHID-SMALL': '3inch',
    'PLANT-ORCHID-FUSED': 'fused', 'PLANT-ORCHID-CASCADE-PREMIUM': 'cascades',
    'PLANT-ORCHID-ARRANGEMENT': 'arrangements',
    'PLANT-ARRANGEMENT': 'arrangements',
}
DC_SHEETS = ['FULRTNCADC ', 'PHOENXAZDC ', 'TRACYCADC']

# ── Helper: try to download a Drive file ──────────────────────────────────────
def try_download_drive(file_id, fw_num):
    """
    Attempt to download a Google Drive file by ID using gdown.
    Returns local temp path on success, None on failure.
    Requires: pip install gdown --break-system-packages
    """
    # Check for pre-downloaded local file first
    local_pre = f'/home/claude/work/WK{fw_num:02d}_DC_TEMPLATE.xlsx'
    if os.path.exists(local_pre) and os.path.getsize(local_pre) > 5000:
        print(f"    Drive WK{fw_num:02d}: using pre-downloaded local file ({os.path.getsize(local_pre)/1024:.1f}KB)")
        return local_pre
    try:
        import gdown
        tmp = tempfile.mktemp(suffix=f'_DC_TEMPLATE_Wk{fw_num:02d}.xlsx')
        url = f'https://drive.google.com/uc?id={file_id}'
        gdown.download(url, tmp, quiet=True)
        if not os.path.exists(tmp):
            print(f"    Drive WK{fw_num:02d}: file not created — skipping")
            return None
        size = os.path.getsize(tmp)
        if size < 5000:  # <5KB = likely corrupt or auth error
            print(f"    Drive WK{fw_num:02d}: too small ({size}B) — skipping")
            os.remove(tmp)
            return None
        print(f"    Drive WK{fw_num:02d}: downloaded {size/1024:.1f}KB")
        return tmp
    except Exception as e:
        print(f"    Drive WK{fw_num:02d}: download failed ({e}) — will check uploads")
        return None

# ── Load Excel files ───────────────────────────────────────────────────────────
print("Loading Excel files...")
df26 = pd.read_excel(FY26_PATH, sheet_name='Export')
df25 = pd.read_excel(FY25_PATH, sheet_name='Sales 2025')

# Normalize legacy Union City DC name → TRACYCADC
df26['DC'] = df26['DC'].str.strip().replace('UNCITYCADC', 'TRACYCADC')
df25['DC'] = df25['DC'].str.strip().replace('UNCITYCADC', 'TRACYCADC')
print("DC normalization: UNCITYCADC → TRACYCADC (FY25 & FY26)")

bd26 = df26[df26['Rollup UPC Desc'].str.contains(PROD_FILTER, na=False, case=False)].copy()
bd25 = df25[df25['Rollup UPC Desc'].str.contains(PROD_FILTER, na=False, case=False)].copy()
bd26['cat'] = bd26['Rollup UPC Desc'].apply(get_cat)
bd25['cat'] = bd25['Rollup UPC Desc'].apply(get_cat)

all_fws_26 = sorted(bd26['Fiscal Week'].dropna().astype(int).unique())
print(f"FY26 FWs: FW{str(min(all_fws_26))[-2:]}–FW{str(max(all_fws_26))[-2:]} ({len(all_fws_26)} weeks)")

# ── 1. DATA26 ─────────────────────────────────────────────────────────────────
print("Building DATA26...")
grp26 = bd26.groupby(['Fiscal Week','DC','Rollup UPC Desc']).agg(
    sales=('Gross Sales','sum'), units=('Total Movement','sum'),
    outbound=(OUT_COL_26,'sum')).reset_index()
rows26 = []
for _, r in grp26.iterrows():
    if pd.isna(r['DC']) or pd.isna(r['Fiscal Week']): continue
    prod = str(r['Rollup UPC Desc'])
    vendor = VENDOR_MAP.get(prod, 'UNKNOWN')
    rows26.append([int(r['Fiscal Week']), str(r['DC']), prod, vendor,
                   round(float(r['sales']),2), int(r['units']),
                   int(r['outbound']) if not pd.isna(r['outbound']) else 0])
print(f"  {len(rows26)} rows | vendors: {sorted(set(r[3] for r in rows26))}")

# ── 2. DATA25 ─────────────────────────────────────────────────────────────────
print("Building DATA25...")
grp25 = bd25.groupby(['Fiscal Week','DC','Rollup UPC Desc']).agg(
    sales=('Gross Sales','sum'), units=('Total Movement','sum'),
    outbound=(OUT_COL_25,'sum')).reset_index()
rows25 = []
for _, r in grp25.iterrows():
    if pd.isna(r['DC']) or pd.isna(r['Fiscal Week']): continue
    rows25.append([int(r['Fiscal Week']), str(r['DC']), str(r['Rollup UPC Desc']),
                   round(float(r['sales']),2), int(r['units']),
                   int(r['outbound']) if not pd.isna(r['outbound']) else 0])
print(f"  {len(rows25)} rows")

# ── 3. STORE_OUTBOUND — base from FY2026_Sprouts.xlsx ─────────────────────────
print("Building STORE_OUTBOUND (base from FY2026_Sprouts.xlsx)...")
bd26_cat = bd26[bd26['cat'].notna()]
bd_out = bd26_cat[bd26_cat[OUT_COL_26] > 0].copy()
ob = {}
for _, row in bd_out.iterrows():
    cat = row['cat']
    store = str(int(row['Store'])) if pd.notna(row['Store']) else None
    fw = str(int(row['Fiscal Week'])) if pd.notna(row['Fiscal Week']) else None
    cases = int(row[OUT_COL_26])
    if not store or not fw: continue
    r = ob.setdefault(cat,{}).setdefault(store,{})
    r[fw] = [r[fw][0]+cases, r[fw][1]+cases*PACK[cat]] if fw in r else [cases, cases*PACK[cat]]
for cat in ['5inch','2inch','3inch','fused','cascades']:
    print(f"  {cat}: {len(ob.get(cat,{}))} stores")

# ── 3b. DC TEMPLATE CORRECTIONS (optional — Drive first, uploads fallback) ────
print("\nResolving DC template sources...")

# Read existing CORRECTIONS_LOG to know which FWs already processed
with open(JSX_PATH,'r') as f:
    _jsx = f.read()
cl_start = _jsx.find('const CORRECTIONS_LOG =')
cl_end = _jsx.find('];', cl_start) + 2
existing_cl_json = _jsx[cl_start+len('const CORRECTIONS_LOG ='):cl_end].rstrip().rstrip(';')
existing_cl = json.loads(existing_cl_json)
already_processed_fws = set(c['fw'] for c in existing_cl)
new_corrections = []
correction_log_lines = []  # human-readable diff log

# Build map of fw_num -> file path, Drive first then uploads fallback
template_paths = {}  # fw_num (int) -> local file path

# 1. Try Google Drive for each known week
for fw_num, drive_id in DRIVE_TEMPLATE_IDS.items():
    fw_full = int(f'2026{fw_num:02d}')
    if fw_full in already_processed_fws:
        print(f"  WK{fw_num:02d}: already in CORRECTIONS_LOG — skip")
        continue
    if drive_id is None:
        print(f"  WK{fw_num:02d}: Drive ID is None — checking uploads only")
        continue
    path = try_download_drive(drive_id, fw_num)
    if path:
        template_paths[fw_num] = path

# 2. Uploads fallback — any *DC_TEMPLATE*.xlsx not already covered by Drive
upload_files = sorted(
    glob.glob('/mnt/user-data/uploads/*DC_TEMPLATE*.xlsx') +
    glob.glob('/mnt/user-data/uploads/*DC_Template*.xlsx') +
    glob.glob('/mnt/user-data/uploads/*dc_template*.xlsx') +
    glob.glob('/mnt/project/*DC_TEMPLATE*.xlsx') +
    glob.glob('/mnt/project/*DC_Template*.xlsx')
)
for fpath in upload_files:
    fname = os.path.basename(fpath)
    fw_match = re.search(r'Wk[_\s]*(\d+)', fname, re.IGNORECASE)
    if not fw_match:
        print(f"  Upload SKIP (can't parse FW from filename): {fname}")
        continue
    fw_num = int(fw_match.group(1))
    fw_full = int(f'2026{fw_num:02d}')
    if fw_full in already_processed_fws:
        print(f"  Upload WK{fw_num:02d}: already in CORRECTIONS_LOG — skip")
        continue
    if fw_num in template_paths:
        print(f"  Upload WK{fw_num:02d}: Drive version already loaded — skipping upload")
        continue
    print(f"  Upload WK{fw_num:02d}: using chat upload fallback — {fname}")
    template_paths[fw_num] = fpath

# 3. Process all resolved template files
if template_paths:
    import openpyxl
    print(f"\nProcessing {len(template_paths)} DC template(s)...")

    # Build store->DC lookup from FY26 for diff logging
    store_dc_lookup = {}
    for _, row in df26.iterrows():
        if pd.notna(row.get('Store')) and pd.notna(row.get('DC')):
            store_dc_lookup[str(int(row['Store']))] = str(row['DC'])

    for fw_num in sorted(template_paths):
        fpath = template_paths[fw_num]
        fw_full = int(f'2026{fw_num:02d}')
        fw_str = str(fw_full)
        is_drive = fw_num in DRIVE_TEMPLATE_IDS and DRIVE_TEMPLATE_IDS.get(fw_num)
        source_label = 'Google Drive' if is_drive else 'Upload'
        print(f"  FW{fw_num:02d} [{source_label}]: {os.path.basename(fpath)}")

        wb = openpyxl.load_workbook(fpath, read_only=True, data_only=True)

        # Read template cases per (store, prod, dc)
        tmpl = {}
        # Also check for legacy UNCITYCADC sheet names and TRACYCADC variants
        sheets_to_check = list(DC_SHEETS) + ['UNCITYCADC ', 'UNCITYCADC', 'TRACYCADC ']
        for sheet_name in sheets_to_check:
            if sheet_name not in wb.sheetnames: continue
            dc = sheet_name.strip()
            # Normalize legacy Union City name to Tracy
            if dc == 'UNCITYCADC':
                dc = 'TRACYCADC'
                print(f'    → Normalized UNCITYCADC → TRACYCADC')
            ws = wb[sheet_name]
            for row in list(ws.rows)[1:]:
                sku = row[0].value
                store = row[1].value
                qty = row[2].value
                if sku and store and qty and isinstance(store, int) and isinstance(qty, (int, float)) and qty > 0:
                    prod = SKU_TO_PROD.get(sku)
                    if prod:
                        key = (str(store), prod, dc)
                        tmpl[key] = tmpl.get(key, 0) + int(qty)

        # Get FY26 base cases for this FW already loaded into ob
        # ob[cat][store][fw_str] = [cases, pieces]
        fw_corrections = []
        processed_store_prods = set()

        # For each entry in template, compare to base and overwrite if different
        for (store_s, prod, dc), tmpl_cases in tmpl.items():
            cat = PROD_TO_CAT.get(prod)
            if not cat: continue
            base_entry = ob.get(cat, {}).get(store_s, {}).get(fw_str)
            base_cases = base_entry[0] if base_entry else 0
            processed_store_prods.add((store_s, cat))

            if tmpl_cases == base_cases:
                continue  # no change needed

            # Template overwrites — DC template is authoritative
            ob.setdefault(cat, {}).setdefault(store_s, {})[fw_str] = [tmpl_cases, tmpl_cases * PACK[cat]]

            log_line = (f"  FW{fw_num:02d} | {dc} | store {store_s} | {prod} | "
                        f"base={base_cases} cases → template={tmpl_cases} cases (Δ{tmpl_cases-base_cases:+d})")
            print(log_line)
            correction_log_lines.append(log_line)

            fw_corrections.append({
                "fw": fw_full, "dc": dc, "store": store_s, "product": prod,
                "orig": base_cases, "corrected": tmpl_cases, "diff": tmpl_cases - base_cases,
                "source": f"DC Template Wk{fw_num:02d} [{source_label}]"
            })

        # Also zero-out stores that have base data but are absent from template
        # (template is authoritative — if store not in template, it received 0 cases)
        for cat in PROD_TO_CAT.values():
            for store_s, fws in ob.get(cat, {}).items():
                if fw_str in fws and (store_s, cat) not in processed_store_prods:
                    dc = store_dc_lookup.get(store_s, 'UNKNOWN')
                    # Only zero out stores belonging to DCs that are in this template
                    if dc not in [s.strip() for s in DC_SHEETS if s.strip() in wb.sheetnames or 
                                  ('UNCITYCADC' in s and 'TRACYCADC' in [ws.strip() for ws in wb.sheetnames])]:
                        continue
                    base_cases = fws[fw_str][0]
                    del ob[cat][store_s][fw_str]
                    log_line = (f"  FW{fw_num:02d} | {dc} | store {store_s} | cat={cat} | "
                                f"base={base_cases} cases → 0 (absent from template)")
                    correction_log_lines.append(log_line)
                    fw_corrections.append({
                        "fw": fw_full, "dc": dc, "store": store_s, "product": f"PLANT-5-ORCHID" if cat=="5inch" else f"PLANT-ORCHID-SMALL" if cat=="3inch" else f"PLANT-ORCHID-FUSED" if cat=="fused" else f"PLANT-ORCHID-CASCADE-PREMIUM",
                        "orig": base_cases, "corrected": 0, "diff": -base_cases,
                        "source": f"DC Template Wk{fw_num:02d} — absent from template"
                    })

        new_corrections.extend(fw_corrections)
        already_processed_fws.add(fw_full)
        print(f"    → {len(fw_corrections)} corrections applied to STORE_OUTBOUND")

        # Clean up Drive temp files
        if fpath != template_paths[fw_num] or fpath.startswith(tempfile.gettempdir()):
            try: os.remove(fpath)
            except: pass
else:
    print("No new DC template files — using FY2026_Sprouts.xlsx base only")

# ── 3b2. Replay existing CORRECTIONS_LOG into STORE_OUTBOUND ─────────────────
print("Replaying existing CORRECTIONS_LOG into STORE_OUTBOUND...")
replayed = 0
# First pass: apply all positive corrections
for entry in existing_cl:
    prod = entry['product']
    cat  = PROD_TO_CAT.get(prod)
    if not cat: continue
    store = str(entry['store'])
    fw    = str(entry['fw'])
    corrected = entry['corrected']
    if corrected > 0:
        ob.setdefault(cat, {}).setdefault(store, {})
        ob[cat][store][fw] = [corrected, corrected * PACK.get(cat, 1)]
    replayed += 1
# Second pass: apply zeros only if no positive correction exists for same store/fw/cat
for entry in existing_cl:
    prod = entry['product']
    cat  = PROD_TO_CAT.get(prod)
    if not cat: continue
    store = str(entry['store'])
    fw    = str(entry['fw'])
    corrected = entry['corrected']
    if corrected == 0:
        # Only zero out if no positive correction already set
        current = ob.get(cat, {}).get(store, {}).get(fw)
        if current is None:
            # No positive correction — remove from base if present
            ob.setdefault(cat, {}).setdefault(store, {})
            if fw in ob[cat][store]:
                del ob[cat][store][fw]
print(f"  {replayed} entries replayed")

# ── 3c. DELIVERY_MATRIX — re-aggregate from corrected STORE_OUTBOUND ──────────
print("\nBuilding DELIVERY_MATRIX from corrected STORE_OUTBOUND...")

# Build store->DC map from FY2026 export
store_dc_map = {}
for _, row in df26.iterrows():
    if pd.notna(row.get('Store')) and pd.notna(row.get('DC')):
        store_dc_map[str(int(row['Store']))] = str(row['DC'])

dm = {}
for cat, stores in ob.items():
    dm_key = CAT_TO_DM.get(cat)
    if not dm_key: continue
    for store_s, fws in stores.items():
        dc = store_dc_map.get(store_s)
        if not dc: continue
        for fw_s, (cases, pieces) in fws.items():
            dm.setdefault(dc, {}).setdefault(dm_key, {})
            dm[dc][dm_key][fw_s] = dm[dc][dm_key].get(fw_s, 0) + cases

# Summary
for dc in sorted(dm):
    for cat_key in sorted(dm[dc]):
        fw_count = len(dm[dc][cat_key])
        total = sum(dm[dc][cat_key].values())
        print(f"  {dc} | {cat_key}: {fw_count} FWs, {total} total cases")

# ── 4. STORE_CAT_UNITS ────────────────────────────────────────────────────────
print("Building STORE_CAT_UNITS...")
scu = {}
for _, row in bd26_cat.iterrows():
    cat = row['cat']
    store = str(int(row['Store'])) if pd.notna(row['Store']) else None
    fw = str(int(row['Fiscal Week'])) if pd.notna(row['Fiscal Week']) else None
    dc = str(row['DC']) if pd.notna(row['DC']) else None
    units = row['Total Movement']
    if not store or not fw or not dc or pd.isna(units) or int(units)<=0: continue
    scu.setdefault(cat,{}).setdefault(store,{}).setdefault(fw,{})[dc] = \
        scu.get(cat,{}).get(store,{}).get(fw,{}).get(dc,0) + int(units)
for cat in ['5inch','2inch','3inch','fused','cascades']:
    print(f"  {cat}: {len(scu.get(cat,{}))} stores")

# ── 5. STORE_DATA ─────────────────────────────────────────────────────────────
print("Building STORE_DATA...")
bd_all26 = df26[df26['Rollup UPC Desc'].str.contains(PROD_FILTER, na=False, case=False)]
sd_grp = bd_all26.groupby(['Fiscal Week','DC','Store']).agg(
    sales=('Gross Sales','sum'), units=('Total Movement','sum')).reset_index()
sd_rows = []
for _, r in sd_grp.iterrows():
    if pd.isna(r['DC']) or pd.isna(r['Store']) or pd.isna(r['Fiscal Week']): continue
    if r['sales'] <= 0 and r['units'] <= 0: continue
    sd_rows.append([int(r['Fiscal Week']), str(r['DC']), int(r['Store']),
                    round(float(r['sales']),2), int(r['units'])])
print(f"  {len(sd_rows)} rows")

# ── 6. SPARK_DATA ─────────────────────────────────────────────────────────────
print("Building SPARK_DATA...")
spark_grp = bd26.groupby(['Rollup UPC Desc','Fiscal Week'])['Gross Sales'].sum().reset_index()
all_prods = sorted(bd26['Rollup UPC Desc'].dropna().unique())
spark = {}
for prod in all_prods:
    vals = []
    for fw in all_fws_26:
        v = spark_grp[(spark_grp['Rollup UPC Desc']==prod)&(spark_grp['Fiscal Week']==fw)]['Gross Sales'].sum()
        vals.append(round(float(v),2))
    spark[prod] = vals
spark_lines = ['"'+k.replace('"', '\\"')+'":['+','.join(str(v) for v in vl)+']' for k,vl in spark.items()]
spark_const = 'const SPARK_DATA = {'+','.join(spark_lines)+'};'
print(f"  {len(spark)} products x {len(all_fws_26)} FWs")

# ── Inject all constants ──────────────────────────────────────────────────────
print("\nInjecting into JSX...")
with open(JSX_PATH,'r') as f:
    content = f.read()

# DATA26 — rfind-based (handles format variations)
d26_start = content.find('const DATA26 =')
d26_end = content.find('\nconst ', d26_start+10)
new_d26 = 'const DATA26 = '+json.dumps(rows26, separators=(',',':'))+';'
content = content[:d26_start] + new_d26 + content[d26_end:]
print("  Replaced: DATA26")

# DATA25 — rfind-based
d25_start = content.find('const DATA25 =')
d25_end = content.find('\nconst ', d25_start+10)
new_d25 = 'const DATA25 = '+json.dumps(rows25, separators=(',',':'))+';'
content = content[:d25_start] + new_d25 + content[d25_end:]
print("  Replaced: DATA25")

replacements = [
    (r'const STORE_OUTBOUND = \{.*?\};',
     'const STORE_OUTBOUND = '+json.dumps(ob, separators=(',',':'))+';'),
    (r'const STORE_CAT_UNITS = \{.*?\};',
     'const STORE_CAT_UNITS = '+json.dumps(scu, separators=(',',':'))+';'),
    (r'const SPARK_DATA = \{.*?\};',
     spark_const),
    (r'const DELIVERY_MATRIX = \{.*?\};',
     'const DELIVERY_MATRIX = '+json.dumps(dm, separators=(',',':'))+';'),
]
for pattern, replacement in replacements:
    new = re.sub(pattern, replacement, content, flags=re.DOTALL)
    if new == content: print(f"  WARNING not matched: {pattern[:50]}")
    else: print(f"  Replaced: {pattern[:40]}"); content = new

# CORRECTIONS_LOG — append new corrections if any
if new_corrections:
    cl_s = content.find('const CORRECTIONS_LOG =')
    cl_e = content.find('\nconst ', cl_s+10)  # find next const declaration
    existing_block = content[cl_s:cl_e]
    # Extract the JSON array from the block
    arr_start = existing_block.index('[')
    arr_end = existing_block.rindex(']') + 1
    existing_json = existing_block[arr_start:arr_end]
    combined = json.loads(existing_json) + new_corrections
    new_cl = 'const CORRECTIONS_LOG = ' + json.dumps(combined, separators=(',',':')) + ';'
    content = content[:cl_s] + new_cl + content[cl_e:]
    print(f"  CORRECTIONS_LOG: +{len(new_corrections)} entries → {len(combined)} total")

# STORE_DATA — full rebuild every run
sd_start = content.find('const STORE_DATA =')
next_const = content.find('\nconst ', sd_start+10)
new_sd_const = 'const STORE_DATA = [\n' + ','.join(json.dumps(r,separators=(',',':')) for r in sd_rows) + ']'
content = content[:sd_start] + new_sd_const + content[next_const:]
print(f"  STORE_DATA: full rebuild {len(sd_rows)} rows, FW{str(min(r[0] for r in sd_rows))[-2:]}–FW{str(max(r[0] for r in sd_rows))[-2:]}")

with open(JSX_PATH,'w') as f:
    f.write(content)

# ── Permanent code fixes (applied every run) ──────────────────────────────────
print("\nApplying permanent code fixes...")
with open(JSX_PATH,'r') as f:
    content = f.read()

code_fixes = [
    # FY25 ST% suppression — outbound data too sparse
    ('const lyST = lyFW?calcST(sumU25(lyW),sumO25(lyW)):null;',
     'const lyST = null; // FY25 outbound too sparse'),
    ('const ytdST25=calcST(sumU25(allFW25),sumO25(allFW25));',
     'const ytdST25=null; // FY25 outbound too sparse'),
    # FY26 top-level ST% suppression — DATA26 outbound column too sparse
    ('const thisST = calcST(thisU, dmOutbound(thisW, latestFW));',
     'const thisST = null; // DATA26 outbound too sparse for reliable ST%'),
    ('const lastST = prevFW?calcST(sumU(lastW),dmOutbound(lastW,prevFW)):null;',
     'const lastST = null; // DATA26 outbound too sparse'),
    ('const stDelta = (thisST!=null&&lastST!=null)?thisST-lastST:null;',
     'const stDelta = null; // DATA26 outbound too sparse'),
    ('const st=calcST(cur.u, dmOutbound(prodRowsThis, latestFW));',
     'const st=null; // DATA26 outbound too sparse'),
    ('const st=calcST(cur.u, dmOutbound(dcRowsThis, latestFW));',
     'const st=null; // DATA26 outbound too sparse'),
    ('const ytdST26=calcST(sumU(allFW26),ytdOutbound26);',
     'const ytdST26=null; // DATA26 outbound too sparse'),
    ('const st=calcST(c.u,c.o);',
     'const st=null; // DATA26 outbound too sparse'),
    # storeSTPct fix — 0 sold with received = 0% ST not null
    ('const storeSTPct = (piecesReceived>0&&unitsSold>0) ? unitsSold/piecesReceived*100 : null;',
     'const storeSTPct = piecesReceived>0 ? unitsSold/piecesReceived*100 : null;'),
    # stForRec fix — only fall back to avgST if store has outbound history
    ('const stForRec = storeSTPct!=null ? storeSTPct : avgST;',
     'const stForRec = storeSTPct!=null ? storeSTPct : (piecesReceived>0 ? avgST : null);'),
    # display fix — show 0 pieces sold not dash
    ('{isInsuff?"—":r.piecesSold>0?r.piecesSold.toLocaleString():"—"}',
     '{isInsuff?"—":r.piecesReceived>0?r.piecesSold.toLocaleString():"—"}'),
    # display fix — ST% show 0% not dash
    ('const storeST = (!isInsuff&&r.piecesReceived>0&&r.piecesSold>0) ? r.piecesSold/r.piecesReceived*100 : null;',
     'const storeST = (!isInsuff&&r.piecesReceived>0) ? r.piecesSold/r.piecesReceived*100 : null;'),
]

for old, new in code_fixes:
    if old in content:
        content = content.replace(old, new, 1)
        print("  Fixed: "+old[:55].strip())
    else:
        print("  Already applied: "+old[:55].strip())

# stLy suppress (regex — 2 occurrences)
import re as re2
content = re2.sub(
    r'const stLy=calcST\(ly\.u,ly\.o\);\s*const stDiff=st!=null&&stLy!=null\?st-stLy:null;',
    'const stLy=null; const stDiff=null;', content)
# st25 suppress (regex — 2 occurrences)
content = re2.sub(
    r'st25=calcST\(b\.u,b\.o\), stD=st26!=null&&st25!=null\?st26-st25:null',
    'st25=null, stD=null', content)
print("  Fixed: stLy, stDiff, st25, stD")

with open(JSX_PATH,'w') as f:
    f.write(content)

# ── Correction diff log summary ───────────────────────────────────────────────
if correction_log_lines:
    print(f"\n=== DC TEMPLATE OVERRIDE LOG ({len(correction_log_lines)} changes) ===")
    for line in correction_log_lines:
        print(line)
else:
    print("\nNo DC template overrides applied this run.")

# ── Verification ──────────────────────────────────────────────────────────────
print("\n=== VERIFICATION ===")
d26_ytd = sum(r[4] for r in rows26)
fw25_vals = set(fw-100 for fw in all_fws_26)
d25_cmp = sum(r[3] for r in rows25 if r[0] in fw25_vals)
yoy = (d26_ytd-d25_cmp)/d25_cmp*100 if d25_cmp else 0
print("FY26 YTD FW"+str(min(all_fws_26))[-2:]+"-FW"+str(max(all_fws_26))[-2:]+": $"+f"{d26_ytd:,.0f}")
print("FY25 comparable: $"+f"{d25_cmp:,.0f}")
print("YoY: "+f"{yoy:+.1f}%")
print("Vendors: "+str(sorted(set(r[3] for r in rows26))))
print("Total lines: "+str(content.count("\n")))

# DELIVERY_MATRIX spot-check — 3in Orchid across all DCs
print("\nDELIVERY_MATRIX spot-check (3in Orchid):")
for dc in sorted(dm):
    v = dm[dc].get('3in Orchid', {})
    if v:
        fw_list = ', '.join(f"FW{str(fw)[-2:]}={cases}" for fw, cases in sorted(v.items()))
        print(f"  {dc}: {fw_list}")
    else:
        print(f"  {dc}: (no 3in Orchid data)")

print("\nDone. Copy "+JSX_PATH+" to outputs and push to GitHub.")
