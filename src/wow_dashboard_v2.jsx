import { useState, useMemo } from "react";

const DATA = [{"fw":202601,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":306.85},{"fw":202601,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":398.88},{"fw":202601,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":5215.72},{"fw":202601,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":857.28},{"fw":202601,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":311.76},{"fw":202601,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":394.85},{"fw":202601,"dc":"DENVERCODC","product":"ORCHID-PLANT","sales":1.99},{"fw":202601,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":2839.16},{"fw":202601,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":671.05},{"fw":202601,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1566.97},{"fw":202601,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":428.1},{"fw":202601,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":249.8},{"fw":202601,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":242.9},{"fw":202601,"dc":"FULRTNCADC","product":"ORCHID-SMALL","sales":13.98},{"fw":202601,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":7412.37},{"fw":202601,"dc":"FULRTNCADC","product":"PLANT-FOOD","sales":65.87},{"fw":202601,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":505.81},{"fw":202601,"dc":"FULRTNCADC","product":"PLANT-ORCHID-FUSED","sales":9.99},{"fw":202601,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":4279.59},{"fw":202601,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":424.65},{"fw":202601,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":487.42},{"fw":202601,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":5582.63},{"fw":202601,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":875.65},{"fw":202601,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":307.78},{"fw":202601,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":460.0},{"fw":202601,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":4232.58},{"fw":202601,"dc":"PHOENXAZDC","product":"PLANT-FOOD","sales":38.97},{"fw":202601,"dc":"PHOENXAZDC","product":"PLANT-ORCHID","sales":20.0},{"fw":202601,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":598.76},{"fw":202601,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":59.98},{"fw":202601,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":1717.1},{"fw":202601,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":141.9},{"fw":202601,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":378.99},{"fw":202601,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":3934.75},{"fw":202601,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":317.86},{"fw":202601,"dc":"UNCITYCADC","product":"PLANT-ORCHID-FUSED","sales":17.48},{"fw":202601,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":1063.59},{"fw":202602,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":223.68},{"fw":202602,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":232.42},{"fw":202602,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":5795.48},{"fw":202602,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":580.47},{"fw":202602,"dc":"DALLASTXDC","product":"ORCHID-WATERCOLOR","sales":89.97},{"fw":202602,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":156.86},{"fw":202602,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":397.63},{"fw":202602,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":2821.9},{"fw":202602,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":1300.44},{"fw":202602,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1406.47},{"fw":202602,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":367.29},{"fw":202602,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":266.71},{"fw":202602,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":173.89},{"fw":202602,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":6542.99},{"fw":202602,"dc":"FULRTNCADC","product":"PLANT-FOOD","sales":65.93},{"fw":202602,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":737.71},{"fw":202602,"dc":"FULRTNCADC","product":"PLANT-ORCHID-FUSED","sales":74.97},{"fw":202602,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":5375.79},{"fw":202602,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":194.85},{"fw":202602,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":295.93},{"fw":202602,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":5021.74},{"fw":202602,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":3196.02},{"fw":202602,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":210.75},{"fw":202602,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":338.67},{"fw":202602,"dc":"PHOENXAZDC","product":"ORCHID-SMALL","sales":12.99},{"fw":202602,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":3412.58},{"fw":202602,"dc":"PHOENXAZDC","product":"PLANT-FOOD","sales":9.99},{"fw":202602,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":509.8},{"fw":202602,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":29.99},{"fw":202602,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":3070.57},{"fw":202602,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":124.87},{"fw":202602,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":143.92},{"fw":202602,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":3071.66},{"fw":202602,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":521.72},{"fw":202602,"dc":"UNCITYCADC","product":"PLANT-ORCHID-FUSED","sales":1.99},{"fw":202602,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":1858.3},{"fw":202603,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":171.8},{"fw":202603,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":252.49},{"fw":202603,"dc":"DALLASTXDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":19.99},{"fw":202603,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":4996.96},{"fw":202603,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":653.43},{"fw":202603,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":160.69},{"fw":202603,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":202.8},{"fw":202603,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":2483.97},{"fw":202603,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":1870.38},{"fw":202603,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":937.75},{"fw":202603,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":537.96},{"fw":202603,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":28.97},{"fw":202603,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":140.0},{"fw":202603,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":7360.54},{"fw":202603,"dc":"FULRTNCADC","product":"PLANT-FOOD","sales":9.99},{"fw":202603,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":816.45},{"fw":202603,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":4530.98},{"fw":202603,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":51.96},{"fw":202603,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":192.94},{"fw":202603,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":3347.35},{"fw":202603,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":2752.75},{"fw":202603,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":92.43},{"fw":202603,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":200.99},{"fw":202603,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":4092.02},{"fw":202603,"dc":"PHOENXAZDC","product":"PLANT-FOOD","sales":19.98},{"fw":202603,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":167.43},{"fw":202603,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":73.97},{"fw":202603,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":2281.74},{"fw":202603,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":61.88},{"fw":202603,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":108.56},{"fw":202603,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":3281.24},{"fw":202603,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":472.27},{"fw":202603,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":973.05},{"fw":202604,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":38.97},{"fw":202604,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":137.0},{"fw":202604,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":3617.11},{"fw":202604,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":431.12},{"fw":202604,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":125.88},{"fw":202604,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":120.0},{"fw":202604,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":2199.5},{"fw":202604,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":1373.1},{"fw":202604,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1265.79},{"fw":202604,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":497.46},{"fw":202604,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":109.34},{"fw":202604,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":120.82},{"fw":202604,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":8472.29},{"fw":202604,"dc":"FULRTNCADC","product":"PLANT-FOOD","sales":39.96},{"fw":202604,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":350.87},{"fw":202604,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":2541.02},{"fw":202604,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":142.89},{"fw":202604,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":197.74},{"fw":202604,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":4881.64},{"fw":202604,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":2175.93},{"fw":202604,"dc":"ORLNDOFLDC","product":"ORCHID-WATERCOLOR","sales":32.98},{"fw":202604,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":170.9},{"fw":202604,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":170.0},{"fw":202604,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":3004.97},{"fw":202604,"dc":"PHOENXAZDC","product":"PLANT-FOOD","sales":19.98},{"fw":202604,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":304.38},{"fw":202604,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":1456.3},{"fw":202604,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":135.77},{"fw":202604,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":125.84},{"fw":202604,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":3887.11},{"fw":202604,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":117.93},{"fw":202604,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":514.47},{"fw":202605,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":90.93},{"fw":202605,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":45.0},{"fw":202605,"dc":"DALLASTXDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":276.82},{"fw":202605,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":3795.92},{"fw":202605,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":275.21},{"fw":202605,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":99.21},{"fw":202605,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":95.64},{"fw":202605,"dc":"DENVERCODC","product":"ORCHID-PETITE GARDEN- 5IN","sales":632.12},{"fw":202605,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":3014.8},{"fw":202605,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":872.41},{"fw":202605,"dc":"FOURSEASON","product":"ORCHID-PETITE GARDEN- 5IN","sales":39.98},{"fw":202605,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1018.05},{"fw":202605,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":120.37},{"fw":202605,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":45.95},{"fw":202605,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":110.0},{"fw":202605,"dc":"FULRTNCADC","product":"ORCHID-ARRANGEMENT DUO","sales":1113.66},{"fw":202605,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":9768.96},{"fw":202605,"dc":"FULRTNCADC","product":"PLANT-FOOD","sales":79.91},{"fw":202605,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":350.87},{"fw":202605,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":1581.17},{"fw":202605,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":116.91},{"fw":202605,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":175.0},{"fw":202605,"dc":"ORLNDOFLDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":900.53},{"fw":202605,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":4447.94},{"fw":202605,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":919.26},{"fw":202605,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":69.95},{"fw":202605,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":110.0},{"fw":202605,"dc":"PHOENXAZDC","product":"ORCHID-ARRANGEMENT DUO","sales":296.91},{"fw":202605,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":3616.06},{"fw":202605,"dc":"PHOENXAZDC","product":"PLANT-FOOD","sales":29.97},{"fw":202605,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":-0.01},{"fw":202605,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":29.99},{"fw":202605,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":640.76},{"fw":202605,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":99.87},{"fw":202605,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":140.0},{"fw":202605,"dc":"UNCITYCADC","product":"ORCHID-ARRANGEMENT DUO","sales":707.78},{"fw":202605,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":4878.19},{"fw":202605,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":298.84},{"fw":202605,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":385.44},{"fw":202606,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":38.97},{"fw":202606,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":30.0},{"fw":202606,"dc":"DALLASTXDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":2215.62},{"fw":202606,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":6881.78},{"fw":202606,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":545.48},{"fw":202606,"dc":"DALLASTXDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1170.58},{"fw":202606,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":165.84},{"fw":202606,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":72.85},{"fw":202606,"dc":"DENVERCODC","product":"ORCHID-PETITE GARDEN- 5IN","sales":1457.92},{"fw":202606,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":3126.97},{"fw":202606,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":773.75},{"fw":202606,"dc":"DENVERCODC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":662.7},{"fw":202606,"dc":"FOURSEASON","product":"ORCHID-PETITE GARDEN- 5IN","sales":283.76},{"fw":202606,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1091.08},{"fw":202606,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":238.23},{"fw":202606,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":12.99},{"fw":202606,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":145.0},{"fw":202606,"dc":"FULRTNCADC","product":"ORCHID-ARRANGEMENT DUO","sales":1453.37},{"fw":202606,"dc":"FULRTNCADC","product":"ORCHID-SWEETHEART","sales":99.95},{"fw":202606,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":9757.56},{"fw":202606,"dc":"FULRTNCADC","product":"PLANT-FOOD","sales":11.45},{"fw":202606,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":136.94},{"fw":202606,"dc":"FULRTNCADC","product":"PLANT-ORCHID-FUSED","sales":29.99},{"fw":202606,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":609.42},{"fw":202606,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":97.86},{"fw":202606,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":136.98},{"fw":202606,"dc":"ORLNDOFLDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":1607.74},{"fw":202606,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":4669.5},{"fw":202606,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":1226.86},{"fw":202606,"dc":"ORLNDOFLDC","product":"ORCHID-WATERCOLOR","sales":-44.95},{"fw":202606,"dc":"ORLNDOFLDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1115.57},{"fw":202606,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":85.86},{"fw":202606,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":141.0},{"fw":202606,"dc":"PHOENXAZDC","product":"ORCHID-ARRANGEMENT DUO","sales":542.83},{"fw":202606,"dc":"PHOENXAZDC","product":"ORCHID-SWEETHEART","sales":41.97},{"fw":202606,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":4761.06},{"fw":202606,"dc":"PHOENXAZDC","product":"PLANT-FOOD","sales":19.98},{"fw":202606,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":148.94},{"fw":202606,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":29.99},{"fw":202606,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":276.3},{"fw":202606,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":37.96},{"fw":202606,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":32.94},{"fw":202606,"dc":"UNCITYCADC","product":"ORCHID-ARRANGEMENT DUO","sales":1197.79},{"fw":202606,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":4633.24},{"fw":202606,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":176.67},{"fw":202606,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":184.68},{"fw":202607,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":64.95},{"fw":202607,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":85.0},{"fw":202607,"dc":"DALLASTXDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":2878.4},{"fw":202607,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":11444.22},{"fw":202607,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":5999.67},{"fw":202607,"dc":"DALLASTXDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":3585.16},{"fw":202607,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":168.84},{"fw":202607,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":18.64},{"fw":202607,"dc":"DENVERCODC","product":"ORCHID-PETITE GARDEN- 5IN","sales":1565.15},{"fw":202607,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":6533.91},{"fw":202607,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":4199.88},{"fw":202607,"dc":"DENVERCODC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1811.53},{"fw":202607,"dc":"FOURSEASON","product":"ORCHID-PETITE GARDEN- 5IN","sales":718.6},{"fw":202607,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":3541.67},{"fw":202607,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":894.69},{"fw":202607,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":38.97},{"fw":202607,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":77.97},{"fw":202607,"dc":"FULRTNCADC","product":"ORCHID-ARRANGEMENT DUO","sales":1982.25},{"fw":202607,"dc":"FULRTNCADC","product":"ORCHID-SWEETHEART","sales":2135.31},{"fw":202607,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":17726.35},{"fw":202607,"dc":"FULRTNCADC","product":"PLANT-FOOD","sales":19.98},{"fw":202607,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":350.87},{"fw":202607,"dc":"FULRTNCADC","product":"PLANT-ORCHID-FUSED","sales":11743.06},{"fw":202607,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":498.19},{"fw":202607,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":168.87},{"fw":202607,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":98.96},{"fw":202607,"dc":"ORLNDOFLDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":2667.27},{"fw":202607,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":10433.96},{"fw":202607,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":5639.13},{"fw":202607,"dc":"ORLNDOFLDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":6397.35},{"fw":202607,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":103.92},{"fw":202607,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":135.0},{"fw":202607,"dc":"PHOENXAZDC","product":"ORCHID-ARRANGEMENT DUO","sales":936.69},{"fw":202607,"dc":"PHOENXAZDC","product":"ORCHID-SWEETHEART","sales":1393.2},{"fw":202607,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":9185.61},{"fw":202607,"dc":"PHOENXAZDC","product":"PLANT-FOOD","sales":49.95},{"fw":202607,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":53.97},{"fw":202607,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":5576.98},{"fw":202607,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":254.8},{"fw":202607,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":87.76},{"fw":202607,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":44.91},{"fw":202607,"dc":"UNCITYCADC","product":"ORCHID-ARRANGEMENT DUO","sales":673.62},{"fw":202607,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":6298.93},{"fw":202607,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":213.64},{"fw":202607,"dc":"UNCITYCADC","product":"PLANT-ORCHID-FUSED","sales":5553.91},{"fw":202607,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":124.89},{"fw":202608,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":38.97},{"fw":202608,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":45.0},{"fw":202608,"dc":"DALLASTXDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":1052.2},{"fw":202608,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":4565.25},{"fw":202608,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":1749.98},{"fw":202608,"dc":"DALLASTXDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":696.12},{"fw":202608,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":51.96},{"fw":202608,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":1.24},{"fw":202608,"dc":"DENVERCODC","product":"ORCHID-PETITE GARDEN- 5IN","sales":336.72},{"fw":202608,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":2267.1},{"fw":202608,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":1036.0},{"fw":202608,"dc":"DENVERCODC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":464.77},{"fw":202608,"dc":"FOURSEASON","product":"ORCHID-PETITE GARDEN- 5IN","sales":232.83},{"fw":202608,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1154.81},{"fw":202608,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":499.11},{"fw":202608,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":12.99},{"fw":202608,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":35.84},{"fw":202608,"dc":"FULRTNCADC","product":"ORCHID-ARRANGEMENT DUO","sales":580.18},{"fw":202608,"dc":"FULRTNCADC","product":"ORCHID-CASCADE","sales":9.99},{"fw":202608,"dc":"FULRTNCADC","product":"ORCHID-SWEETHEART","sales":265.73},{"fw":202608,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":7027.08},{"fw":202608,"dc":"FULRTNCADC","product":"PLANT-FOOD","sales":9.99},{"fw":202608,"dc":"FULRTNCADC","product":"PLANT-ORCHID","sales":109.96},{"fw":202608,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":53.98},{"fw":202608,"dc":"FULRTNCADC","product":"PLANT-ORCHID-FUSED","sales":4252.11},{"fw":202608,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":122.88},{"fw":202608,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":25.98},{"fw":202608,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":100.0},{"fw":202608,"dc":"ORLNDOFLDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":697.92},{"fw":202608,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":4030.48},{"fw":202608,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":1801.57},{"fw":202608,"dc":"ORLNDOFLDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1107.57},{"fw":202608,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":83.88},{"fw":202608,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":114.95},{"fw":202608,"dc":"PHOENXAZDC","product":"ORCHID-ARRANGEMENT DUO","sales":200.86},{"fw":202608,"dc":"PHOENXAZDC","product":"ORCHID-PREMIUM-CERAMIC","sales":19.99},{"fw":202608,"dc":"PHOENXAZDC","product":"ORCHID-SWEETHEART","sales":161.77},{"fw":202608,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":4240.7},{"fw":202608,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":26.99},{"fw":202608,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":3969.44},{"fw":202608,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":47.44},{"fw":202608,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":57.84},{"fw":202608,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":15.88},{"fw":202608,"dc":"UNCITYCADC","product":"ORCHID-ARRANGEMENT DUO","sales":341.34},{"fw":202608,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":2757.38},{"fw":202608,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":68.95},{"fw":202608,"dc":"UNCITYCADC","product":"PLANT-ORCHID-FUSED","sales":2543.96},{"fw":202608,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":16.95},{"fw":202609,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":25.98},{"fw":202609,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":55.94},{"fw":202609,"dc":"DALLASTXDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":1843.47},{"fw":202609,"dc":"DALLASTXDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":555.99},{"fw":202609,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":4691.74},{"fw":202609,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":974.49},{"fw":202609,"dc":"DALLASTXDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1838.8},{"fw":202609,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":25.98},{"fw":202609,"dc":"DENVERCODC","product":"ORCHID-MINI STADIUM-2.5IN","sales":809.85},{"fw":202609,"dc":"DENVERCODC","product":"ORCHID-PETITE GARDEN- 5IN","sales":259.84},{"fw":202609,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":2608.15},{"fw":202609,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":555.48},{"fw":202609,"dc":"DENVERCODC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":940.6},{"fw":202609,"dc":"FOURSEASON","product":"ORCHID-MINI STADIUM-2.5IN","sales":96.87},{"fw":202609,"dc":"FOURSEASON","product":"ORCHID-PETITE GARDEN- 5IN","sales":199.87},{"fw":202609,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1046.86},{"fw":202609,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":266.9},{"fw":202609,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":25.0},{"fw":202609,"dc":"FULRTNCADC","product":"ORCHID-ARRANGEMENT DUO","sales":484.33},{"fw":202609,"dc":"FULRTNCADC","product":"ORCHID-MINI STADIUM-2.5IN","sales":1475.11},{"fw":202609,"dc":"FULRTNCADC","product":"ORCHID-SMALL","sales":12.99},{"fw":202609,"dc":"FULRTNCADC","product":"ORCHID-SWEETHEART","sales":94.94},{"fw":202609,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":7296.1},{"fw":202609,"dc":"FULRTNCADC","product":"PLANT-ORCHID","sales":39.98},{"fw":202609,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":927.02},{"fw":202609,"dc":"FULRTNCADC","product":"PLANT-ORCHID-FUSED","sales":2434.98},{"fw":202609,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":1725.53},{"fw":202609,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":25.98},{"fw":202609,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":30.0},{"fw":202609,"dc":"ORLNDOFLDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":1032.92},{"fw":202609,"dc":"ORLNDOFLDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":479.7},{"fw":202609,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":3920.03},{"fw":202609,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":1068.01},{"fw":202609,"dc":"ORLNDOFLDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":2237.53},{"fw":202609,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":51.96},{"fw":202609,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":87.5},{"fw":202609,"dc":"PHOENXAZDC","product":"ORCHID-ARRANGEMENT DUO","sales":32.99},{"fw":202609,"dc":"PHOENXAZDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":890.86},{"fw":202609,"dc":"PHOENXAZDC","product":"ORCHID-SWEETHEART","sales":43.94},{"fw":202609,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":3843.72},{"fw":202609,"dc":"PHOENXAZDC","product":"PLANT-ORCHID","sales":10.0},{"fw":202609,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":161.94},{"fw":202609,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":3081.91},{"fw":202609,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":424.83},{"fw":202609,"dc":"UNCITYCADC","product":"LAVENDER-SACHET","sales":5.0},{"fw":202609,"dc":"UNCITYCADC","product":"ORCHID-ARRANGEMENT DUO","sales":128.92},{"fw":202609,"dc":"UNCITYCADC","product":"ORCHID-MINI STADIUM-2.5IN","sales":723.97},{"fw":202609,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":2885.25},{"fw":202609,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":404.85},{"fw":202609,"dc":"UNCITYCADC","product":"PLANT-ORCHID-FUSED","sales":1319.43},{"fw":202609,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":1063.63},{"fw":202610,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":25.98},{"fw":202610,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":102.5},{"fw":202610,"dc":"DALLASTXDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":1568.67},{"fw":202610,"dc":"DALLASTXDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":302.56},{"fw":202610,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":5165.06},{"fw":202610,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":516.94},{"fw":202610,"dc":"DALLASTXDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1723.31},{"fw":202610,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":69.9},{"fw":202610,"dc":"DENVERCODC","product":"LAVENDER-SACHET","sales":10.0},{"fw":202610,"dc":"DENVERCODC","product":"ORCHID-MINI STADIUM-2.5IN","sales":962.35},{"fw":202610,"dc":"DENVERCODC","product":"ORCHID-PETITE GARDEN- 5IN","sales":75.85},{"fw":202610,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":3138.25},{"fw":202610,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":274.84},{"fw":202610,"dc":"DENVERCODC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1575.29},{"fw":202610,"dc":"FOURSEASON","product":"ORCHID-MINI STADIUM-2.5IN","sales":386.4},{"fw":202610,"dc":"FOURSEASON","product":"ORCHID-PETITE GARDEN- 5IN","sales":97.93},{"fw":202610,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1533.64},{"fw":202610,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":265.27},{"fw":202610,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":12.99},{"fw":202610,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":20.0},{"fw":202610,"dc":"FULRTNCADC","product":"ORCHID-ARRANGEMENT DUO","sales":107.26},{"fw":202610,"dc":"FULRTNCADC","product":"ORCHID-FUSED-COLORED","sales":9.99},{"fw":202610,"dc":"FULRTNCADC","product":"ORCHID-MINI STADIUM-2.5IN","sales":2378.93},{"fw":202610,"dc":"FULRTNCADC","product":"ORCHID-SMALL","sales":12.99},{"fw":202610,"dc":"FULRTNCADC","product":"ORCHID-SWEETHEART","sales":22.55},{"fw":202610,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":7510.17},{"fw":202610,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":1801.69},{"fw":202610,"dc":"FULRTNCADC","product":"PLANT-ORCHID-FUSED","sales":1331.92},{"fw":202610,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":4886.99},{"fw":202610,"dc":"ORLNDOFLDC","product":"LAVENDER-BUNCH-DRIED","sales":25.98},{"fw":202610,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":56.2},{"fw":202610,"dc":"ORLNDOFLDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":1704.71},{"fw":202610,"dc":"ORLNDOFLDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":210.77},{"fw":202610,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":6070.48},{"fw":202610,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":413.54},{"fw":202610,"dc":"ORLNDOFLDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":2545.98},{"fw":202610,"dc":"PHOENXAZDC","product":"LAVENDER-BUNCH-DRIED","sales":12.99},{"fw":202610,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":57.43},{"fw":202610,"dc":"PHOENXAZDC","product":"ORCHID-ARRANGEMENT DUO","sales":16.49},{"fw":202610,"dc":"PHOENXAZDC","product":"ORCHID-DENDRONBIUM-NOBILE","sales":19.99},{"fw":202610,"dc":"PHOENXAZDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":824.12},{"fw":202610,"dc":"PHOENXAZDC","product":"ORCHID-SWEETHEART","sales":39.98},{"fw":202610,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":4324.1},{"fw":202610,"dc":"PHOENXAZDC","product":"PLANT-ORCHID","sales":10.0},{"fw":202610,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":780.7},{"fw":202610,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":1140.58},{"fw":202610,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":1529.14},{"fw":202610,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":12.99},{"fw":202610,"dc":"UNCITYCADC","product":"ORCHID-ARRANGEMENT DUO","sales":73.19},{"fw":202610,"dc":"UNCITYCADC","product":"ORCHID-MINI STADIUM-2.5IN","sales":1240.95},{"fw":202610,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":3418.46},{"fw":202610,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":943.11},{"fw":202610,"dc":"UNCITYCADC","product":"PLANT-ORCHID-FUSED","sales":618.59},{"fw":202610,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":2883.73},{"fw":202611,"dc":"DALLASTXDC","product":"LAVENDER-BUNCH-DRIED","sales":64.95},{"fw":202611,"dc":"DALLASTXDC","product":"LAVENDER-SACHET","sales":60.0},{"fw":202611,"dc":"DALLASTXDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":750.89},{"fw":202611,"dc":"DALLASTXDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":179.9},{"fw":202611,"dc":"DALLASTXDC","product":"ORCHID-PREMIUM-CERAMIC","sales":4468.49},{"fw":202611,"dc":"DALLASTXDC","product":"ORCHID-SMALL","sales":2467.72},{"fw":202611,"dc":"DALLASTXDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1172.52},{"fw":202611,"dc":"DENVERCODC","product":"LAVENDER-BUNCH-DRIED","sales":25.98},{"fw":202611,"dc":"DENVERCODC","product":"ORCHID-MINI STADIUM-2.5IN","sales":627.97},{"fw":202611,"dc":"DENVERCODC","product":"ORCHID-PETITE GARDEN- 5IN","sales":39.98},{"fw":202611,"dc":"DENVERCODC","product":"ORCHID-PREMIUM-CERAMIC","sales":2415.75},{"fw":202611,"dc":"DENVERCODC","product":"ORCHID-SMALL","sales":900.3},{"fw":202611,"dc":"DENVERCODC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1115.37},{"fw":202611,"dc":"FOURSEASON","product":"ORCHID-MINI STADIUM-2.5IN","sales":401.95},{"fw":202611,"dc":"FOURSEASON","product":"ORCHID-PETITE GARDEN- 5IN","sales":93.89},{"fw":202611,"dc":"FOURSEASON","product":"ORCHID-PREMIUM-CERAMIC","sales":1013.34},{"fw":202611,"dc":"FOURSEASON","product":"ORCHID-SMALL","sales":272.25},{"fw":202611,"dc":"FULRTNCADC","product":"LAVENDER-BUNCH-DRIED","sales":12.99},{"fw":202611,"dc":"FULRTNCADC","product":"LAVENDER-SACHET","sales":10.0},{"fw":202611,"dc":"FULRTNCADC","product":"ORCHID-ARRANGEMENT DUO","sales":159.92},{"fw":202611,"dc":"FULRTNCADC","product":"ORCHID-MINI STADIUM-2.5IN","sales":1693.24},{"fw":202611,"dc":"FULRTNCADC","product":"ORCHID-SWEETHEART","sales":25.99},{"fw":202611,"dc":"FULRTNCADC","product":"PLANT-5-ORCHID","sales":7898.58},{"fw":202611,"dc":"FULRTNCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":1479.43},{"fw":202611,"dc":"FULRTNCADC","product":"PLANT-ORCHID-FUSED","sales":734.74},{"fw":202611,"dc":"FULRTNCADC","product":"PLANT-ORCHID-SMALL","sales":3409.83},{"fw":202611,"dc":"ORLNDOFLDC","product":"LAVENDER-SACHET","sales":25.0},{"fw":202611,"dc":"ORLNDOFLDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":1418.25},{"fw":202611,"dc":"ORLNDOFLDC","product":"ORCHID-PETITE GARDEN- 5IN","sales":105.35},{"fw":202611,"dc":"ORLNDOFLDC","product":"ORCHID-PREMIUM-CERAMIC","sales":5655.24},{"fw":202611,"dc":"ORLNDOFLDC","product":"ORCHID-SMALL","sales":1306.18},{"fw":202611,"dc":"ORLNDOFLDC","product":"ORCHID-WATERFALL-PREMIUM-5IN","sales":1686.29},{"fw":202611,"dc":"PHOENXAZDC","product":"LAVENDER-SACHET","sales":5.0},{"fw":202611,"dc":"PHOENXAZDC","product":"ORCHID-MINI STADIUM-2.5IN","sales":925.45},{"fw":202611,"dc":"PHOENXAZDC","product":"ORCHID-SWEETHEART","sales":14.99},{"fw":202611,"dc":"PHOENXAZDC","product":"PLANT-5-ORCHID","sales":4409.58},{"fw":202611,"dc":"PHOENXAZDC","product":"PLANT-FOOD","sales":68.22},{"fw":202611,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":847.17},{"fw":202611,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-FUSED","sales":1056.48},{"fw":202611,"dc":"PHOENXAZDC","product":"PLANT-ORCHID-SMALL","sales":1701.28},{"fw":202611,"dc":"UNCITYCADC","product":"LAVENDER-BUNCH-DRIED","sales":25.98},{"fw":202611,"dc":"UNCITYCADC","product":"ORCHID-ARRANGEMENT DUO","sales":34.97},{"fw":202611,"dc":"UNCITYCADC","product":"ORCHID-MINI STADIUM-2.5IN","sales":733.98},{"fw":202611,"dc":"UNCITYCADC","product":"PLANT-5-ORCHID","sales":3127.55},{"fw":202611,"dc":"UNCITYCADC","product":"PLANT-ORCHID-CASCADE-PREMIUM","sales":218.91},{"fw":202611,"dc":"UNCITYCADC","product":"PLANT-ORCHID-FUSED","sales":467.82},{"fw":202611,"dc":"UNCITYCADC","product":"PLANT-ORCHID-SMALL","sales":1728.33}];

const ALL_FWS = [...new Set(DATA.map(d => d.fw))].sort();
const ALL_DCS = [...new Set(DATA.map(d => d.dc))].sort();
const ALL_PRODUCTS = [...new Set(DATA.map(d => d.product))].sort();

const FW_LABELS = {202601:"FW01",202602:"FW02",202603:"FW03",202604:"FW04",202605:"FW05",202606:"FW06",202607:"FW07",202608:"FW08",202609:"FW09",202610:"FW10",202611:"FW11"};

const fmt = (n) => n == null ? "—" : "$" + Math.abs(n).toLocaleString("en-US", {minimumFractionDigits:2,maximumFractionDigits:2});
const fmtPct = (n) => n == null ? "—" : (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
const fmtDelta = (n) => n == null ? "—" : (n >= 0 ? "+" : "-") + "$" + Math.abs(n).toLocaleString("en-US", {minimumFractionDigits:2,maximumFractionDigits:2});

function MultiSelect({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const allSelected = selected.length === options.length;

  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  };
  const toggleAll = () => allSelected ? onChange([]) : onChange([...options]);

  return (
    <div style={{position:"relative",display:"inline-block",minWidth:180}}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background:"#1a1a2e", border:"1px solid #334",color:"#a0b4c8",
          padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:12,
          width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"
        }}
      >
        <span>{label}: {allSelected ? "All" : selected.length === 0 ? "None" : selected.length + " sel."}</span>
        <span style={{marginLeft:8,opacity:0.6}}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{
          position:"absolute",zIndex:999,top:"100%",left:0,background:"#12122a",
          border:"1px solid #334",borderRadius:6,minWidth:220,maxHeight:260,overflowY:"auto",
          boxShadow:"0 8px 32px #0006"
        }}>
          <div
            onClick={toggleAll}
            style={{padding:"8px 14px",cursor:"pointer",borderBottom:"1px solid #223",color:"#7ec8e3",fontSize:12,fontWeight:600}}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </div>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                padding:"7px 14px",cursor:"pointer",fontSize:11,
                color: selected.includes(opt) ? "#7ec8e3" : "#8899aa",
                background: selected.includes(opt) ? "#1e2a3a" : "transparent",
                display:"flex",alignItems:"center",gap:8
              }}
            >
              <span style={{
                width:12,height:12,borderRadius:3,border:"1px solid #446",
                background: selected.includes(opt) ? "#4a9eff" : "transparent",
                display:"inline-block",flexShrink:0
              }} />
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function KpiTile({ label, value, delta, pct, accent }) {
  const pos = delta == null ? null : delta >= 0;
  const color = pos === null ? "#7ec8e3" : pos ? "#4ade80" : "#f87171";
  return (
    <div style={{
      background:"linear-gradient(135deg,#16213e 60%,#0f3460 100%)",
      border:"1px solid #1e3a5a",borderRadius:10,padding:"18px 20px",
      minWidth:160,flex:1
    }}>
      <div style={{fontSize:10,color:"#5a7a9a",fontFamily:"'DM Mono',monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,color:"#e8f4fd",fontFamily:"'Space Grotesk',sans-serif"}}>{value}</div>
      {delta != null && (
        <div style={{marginTop:4,display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:12,color,fontFamily:"'DM Mono',monospace"}}>{fmtDelta(delta)}</span>
          <span style={{fontSize:11,color,background:color+"22",borderRadius:4,padding:"1px 5px"}}>{fmtPct(pct)}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [selFW, setSelFW] = useState([...ALL_FWS]);
  const [selDC, setSelDC] = useState([...ALL_DCS]);
  const [selProd, setSelProd] = useState([...ALL_PRODUCTS]);
  const [sortByProd, setSortByProd] = useState("sales");
  const [sortByDC, setSortByDC] = useState("sales");

  const filtered = useMemo(() =>
    DATA.filter(d => selFW.includes(d.fw) && selDC.includes(d.dc) && selProd.includes(d.product)),
    [selFW, selDC, selProd]
  );

  // For WoW we need the two most recent selected FWs
  const sortedSelFW = [...selFW].sort();
  const latestFW = sortedSelFW[sortedSelFW.length - 1];
  const prevFW = sortedSelFW[sortedSelFW.length - 2];

  const salesByFW = useMemo(() => {
    const map = {};
    filtered.forEach(d => { map[d.fw] = (map[d.fw] || 0) + d.sales; });
    return map;
  }, [filtered]);

  const thisSales = salesByFW[latestFW] || 0;
  const lastSales = salesByFW[prevFW] || 0;
  const wowDollar = latestFW && prevFW ? thisSales - lastSales : null;
  const wowPct = lastSales ? ((thisSales - lastSales) / lastSales) * 100 : null;

  // YTD
  const ytdSales = filtered.reduce((s, d) => s + d.sales, 0);

  // By Product table
  const byProduct = useMemo(() => {
    const tw = {}, pw = {};
    filtered.forEach(d => {
      if (d.fw === latestFW) tw[d.product] = (tw[d.product] || 0) + d.sales;
      if (d.fw === prevFW) pw[d.product] = (pw[d.product] || 0) + d.sales;
    });
    return ALL_PRODUCTS
      .filter(p => selProd.includes(p))
      .map(p => {
        const t = tw[p] || 0, pr = pw[p] || 0;
        const delta = t - pr;
        const pct = pr ? (delta / pr) * 100 : null;
        return { product: p, thisSales: t, prevSales: pr, delta, pct };
      })
      .filter(r => r.thisSales > 0 || r.prevSales > 0)
      .sort((a, b) => sortByProd === "sales" ? b.thisSales - a.thisSales : b.delta - a.delta);
  }, [filtered, latestFW, prevFW, selProd, sortByProd]);

  // By DC table
  const byDC = useMemo(() => {
    const tw = {}, pw = {};
    filtered.forEach(d => {
      if (d.fw === latestFW) tw[d.dc] = (tw[d.dc] || 0) + d.sales;
      if (d.fw === prevFW) pw[d.dc] = (pw[d.dc] || 0) + d.sales;
    });
    return ALL_DCS
      .filter(dc => selDC.includes(dc))
      .map(dc => {
        const t = tw[dc] || 0, pr = pw[dc] || 0;
        const delta = t - pr;
        const pct = pr ? (delta / pr) * 100 : null;
        return { dc, thisSales: t, prevSales: pr, delta, pct };
      })
      .filter(r => r.thisSales > 0 || r.prevSales > 0)
      .sort((a, b) => sortByDC === "sales" ? b.thisSales - a.thisSales : b.delta - a.delta);
  }, [filtered, latestFW, prevFW, selDC, sortByDC]);

  const hdr = {
    fontSize:10,color:"#4a6a8a",fontFamily:"'DM Mono',monospace",
    textTransform:"uppercase",letterSpacing:1,padding:"8px 10px",
    borderBottom:"1px solid #1e3a5a",textAlign:"right",cursor:"pointer",userSelect:"none"
  };
  const cell = {
    fontSize:12,color:"#c0d8ec",padding:"8px 10px",
    borderBottom:"1px solid #0d1f33",textAlign:"right",fontFamily:"'DM Mono',monospace"
  };
  const cellL = { ...cell, textAlign:"left",color:"#e0eaf4",fontWeight:500 };
  const posBg = (n) => n > 0 ? "#4ade8022" : n < 0 ? "#f8717122" : "transparent";

  return (
    <div style={{
      background:"#0a0e1a",minHeight:"100vh",fontFamily:"'Space Grotesk',sans-serif",
      color:"#c8dde8", padding:"0 0 40px 0"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background:"linear-gradient(90deg,#0d1b2a,#0a1628)",
        borderBottom:"1px solid #1a2d42",padding:"20px 32px",
        display:"flex",alignItems:"center",gap:16
      }}>
        <div style={{
          width:36,height:36,borderRadius:8,
          background:"linear-gradient(135deg,#1fb06a,#0a7a45)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:18,flexShrink:0
        }}>🌿</div>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"#e8f4fd",letterSpacing:0.5}}>Sprouts Floral — WoW Sales Dashboard</div>
          <div style={{fontSize:11,color:"#4a7090",fontFamily:"'DM Mono',monospace",marginTop:1}}>FY2026 · FW01–FW11 · Gross Sales</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background:"#0c1220",borderBottom:"1px solid #141e30",
        padding:"14px 32px",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"
      }}>
        <span style={{fontSize:10,color:"#3a5a7a",fontFamily:"'DM Mono',monospace",letterSpacing:1,textTransform:"uppercase"}}>Filters</span>
        <MultiSelect label="Fiscal Week" options={ALL_FWS.map(fw => fw)} selected={selFW} onChange={setSelFW} />
        <MultiSelect label="DC" options={ALL_DCS} selected={selDC} onChange={setSelDC} />
        <MultiSelect label="Product" options={ALL_PRODUCTS} selected={selProd} onChange={setSelProd} />
        <button
          onClick={() => { setSelFW([...ALL_FWS]); setSelDC([...ALL_DCS]); setSelProd([...ALL_PRODUCTS]); }}
          style={{
            background:"transparent",border:"1px solid #1e3a5a",color:"#4a7090",
            padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace"
          }}
        >Reset</button>
      </div>

      <div style={{padding:"24px 32px"}}>

        {/* WoW KPI Banner */}
        <div style={{marginBottom:6,fontSize:11,color:"#3a5a7a",fontFamily:"'DM Mono',monospace",letterSpacing:1,textTransform:"uppercase"}}>
          Week-over-Week · {latestFW ? FW_LABELS[latestFW] : "—"} vs {prevFW ? FW_LABELS[prevFW] : "—"}
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:28}}>
          <KpiTile label={"This Week (" + (latestFW ? FW_LABELS[latestFW] : "—") + ")"} value={fmt(thisSales)} />
          <KpiTile label={"Last Week (" + (prevFW ? FW_LABELS[prevFW] : "—") + ")"} value={fmt(lastSales)} />
          <KpiTile label="WoW $ Change" value={wowDollar != null ? fmtDelta(wowDollar) : "—"} delta={wowDollar} pct={wowPct} />
          <KpiTile label="WoW % Change" value={wowPct != null ? fmtPct(wowPct) : "—"} />
          <KpiTile label="YTD (All Sel. Weeks)" value={fmt(ytdSales)} />
        </div>

        {/* Mini sparkline bar chart */}
        <div style={{background:"#0e1829",border:"1px solid #1a2d42",borderRadius:10,padding:"18px 20px",marginBottom:28}}>
          <div style={{fontSize:10,color:"#4a6a8a",fontFamily:"'DM Mono',monospace",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>
            Weekly Sales Trend — All Filters Applied
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
            {ALL_FWS.filter(fw => selFW.includes(fw)).map(fw => {
              const s = salesByFW[fw] || 0;
              const maxS = Math.max(...Object.values(salesByFW).filter(Boolean));
              const h = maxS > 0 ? Math.max(4, (s / maxS) * 72) : 4;
              const isLatest = fw === latestFW;
              return (
                <div key={fw} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:9,color:isLatest?"#7ec8e3":"#3a5a7a",fontFamily:"'DM Mono',monospace"}}>{fmt(s)}</div>
                  <div style={{
                    width:"100%",height:h,
                    background: isLatest ? "linear-gradient(#4a9eff,#1a4aaa)" : "linear-gradient(#2a4a6a,#162a3a)",
                    borderRadius:"3px 3px 0 0",
                    border: isLatest ? "1px solid #4a9eff44" : "none"
                  }} />
                  <div style={{fontSize:9,color:isLatest?"#7ec8e3":"#3a5a7a",fontFamily:"'DM Mono',monospace"}}>{FW_LABELS[fw]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tables row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

          {/* By Product */}
          <div style={{background:"#0e1829",border:"1px solid #1a2d42",borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid #1a2d42",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,fontWeight:600,color:"#7ec8e3",letterSpacing:0.5}}>By Product</span>
              <div style={{display:"flex",gap:6}}>
                <button onClick={() => setSortByProd("sales")} style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:"1px solid #1e3a5a",background:sortByProd==="sales"?"#1e3a5a":"transparent",color:sortByProd==="sales"?"#7ec8e3":"#4a6a8a",cursor:"pointer"}}>$ Sales</button>
                <button onClick={() => setSortByProd("delta")} style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:"1px solid #1e3a5a",background:sortByProd==="delta"?"#1e3a5a":"transparent",color:sortByProd==="delta"?"#7ec8e3":"#4a6a8a",cursor:"pointer"}}>WoW $</button>
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr>
                    <th style={{...hdr,textAlign:"left"}}>Product</th>
                    <th style={hdr}>{latestFW ? FW_LABELS[latestFW] : "This Wk"}</th>
                    <th style={hdr}>{prevFW ? FW_LABELS[prevFW] : "Last Wk"}</th>
                    <th style={hdr}>WoW $</th>
                    <th style={hdr}>WoW %</th>
                  </tr>
                </thead>
                <tbody>
                  {byProduct.map(r => (
                    <tr key={r.product} style={{background: r.product === byProduct[0]?.product ? "#0d1e32" : "transparent"}}>
                      <td style={{...cellL,fontSize:11,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.product}</td>
                      <td style={cell}>{fmt(r.thisSales)}</td>
                      <td style={{...cell,color:"#4a6a8a"}}>{r.prevSales > 0 ? fmt(r.prevSales) : "—"}</td>
                      <td style={{...cell,background:posBg(r.delta),color:r.delta>0?"#4ade80":r.delta<0?"#f87171":"#7ec8e3"}}>{prevFW ? fmtDelta(r.delta) : "—"}</td>
                      <td style={{...cell,color:r.pct!=null&&r.pct>0?"#4ade80":r.pct!=null&&r.pct<0?"#f87171":"#7ec8e3"}}>{r.pct != null ? fmtPct(r.pct) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* By DC */}
          <div style={{background:"#0e1829",border:"1px solid #1a2d42",borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid #1a2d42",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,fontWeight:600,color:"#7ec8e3",letterSpacing:0.5}}>By DC</span>
              <div style={{display:"flex",gap:6}}>
                <button onClick={() => setSortByDC("sales")} style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:"1px solid #1e3a5a",background:sortByDC==="sales"?"#1e3a5a":"transparent",color:sortByDC==="sales"?"#7ec8e3":"#4a6a8a",cursor:"pointer"}}>$ Sales</button>
                <button onClick={() => setSortByDC("delta")} style={{fontSize:10,padding:"3px 8px",borderRadius:4,border:"1px solid #1e3a5a",background:sortByDC==="delta"?"#1e3a5a":"transparent",color:sortByDC==="delta"?"#7ec8e3":"#4a6a8a",cursor:"pointer"}}>WoW $</button>
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr>
                    <th style={{...hdr,textAlign:"left"}}>DC</th>
                    <th style={hdr}>{latestFW ? FW_LABELS[latestFW] : "This Wk"}</th>
                    <th style={hdr}>{prevFW ? FW_LABELS[prevFW] : "Last Wk"}</th>
                    <th style={hdr}>WoW $</th>
                    <th style={hdr}>WoW %</th>
                  </tr>
                </thead>
                <tbody>
                  {byDC.map(r => (
                    <tr key={r.dc}>
                      <td style={cellL}>{r.dc}</td>
                      <td style={cell}>{fmt(r.thisSales)}</td>
                      <td style={{...cell,color:"#4a6a8a"}}>{r.prevSales > 0 ? fmt(r.prevSales) : "—"}</td>
                      <td style={{...cell,background:posBg(r.delta),color:r.delta>0?"#4ade80":r.delta<0?"#f87171":"#7ec8e3"}}>{prevFW ? fmtDelta(r.delta) : "—"}</td>
                      <td style={{...cell,color:r.pct!=null&&r.pct>0?"#4ade80":r.pct!=null&&r.pct<0?"#f87171":"#7ec8e3"}}>{r.pct != null ? fmtPct(r.pct) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
