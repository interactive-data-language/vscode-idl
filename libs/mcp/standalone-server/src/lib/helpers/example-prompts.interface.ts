import type { ExamplePrompt } from '@idl/types/chat';

/**
 * Example prompts shown on the chat welcome screen, grouped by topic.
 * A random subset is selected by the client each time the welcome screen is shown.
 *
 * Entries can be a single string, or an array of strings that are joined
 * together with two new-line characters when displayed.
 *
 * When there is more than one line, only the first appears for a sample prompt.
 *
 * This also helps make it easier to have template/example prompts that you can
 * expand on
 */
export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  // Getting started / general
  `What can you help me do with satellite imagery?`,
  `What ENVI tools are available for vegetation analysis?`,
  `How can I detect change between images using ENVI?`,
  `Explain the difference between supervised and unsupervised classification in ENVI.`,

  // Preprocessing & data prep
  [
    `Stack the 10m and 20m bands from this Sentinel-2 scene into one raster.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Orthorectify this satellite image using the included RPCs and a DEM.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Atmospherically correct this hyperspectral image using FLAASH.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Reproject this raster to UTM Zone 12N.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Mosaic these four adjacent scenes into a single image.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Pan-sharpen this low-resolution multispectral image using the panchromatic band.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],

  // Spectral analysis & indices
  [
    `Calculate NDVI for this image and show me the healthiest vegetation areas.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `What spectral indices can I compute from this dataset?`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Run a spectral angle mapper comparison against this reference spectral library.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Identify likely mineral types in this hyperspectral scene using endmember extraction.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],

  // Classification
  [
    `Classify land cover in this image using a machine learning model.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Run an unsupervised ISODATA classification on this scene and summarize the classes.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Train a deep learning model to detect buildings in this imagery.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Clean up this classification result — remove small isolated pixels and smooth the classes.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Calculate a confusion matrix for my classification against these ground-truth ROIs.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Generate a KMeans machine learning classifier from these sample datasets and then process a third dataset for me.`,
    `Here's the path to my data to train: "C:\\my\\dataset\\image1.dat" and "C:\\my\\dataset\\image1.dat"`,
    `And process this image: "C:\\my\\dataset\\image3.dat"`,
  ],

  // Change detection
  [
    `Compare these two images from different dates and highlight areas of urban growth.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Run change detection between these two SAR images to identify new construction.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Detect flooded areas by comparing before/after SAR imagery.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],

  // SAR / SARscape
  [
    `Generate a coherence map from these two Sentinel-1 SLC acquisitions.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Detect ships in this SAR scene.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Create a DEM from this SAR image pair using InSAR.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Despeckle this SAR image while preserving edge detail.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],

  // Vectors, ROIs & terrain
  [
    `Download OpenStreetMap road vectors for this area and overlay them on my image.`,
    `Here's the path to my data that you should use for the extent: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Generate contour lines from this DEM.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Convert my classification result into polygon shapefiles.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],

  // Agriculture-specific
  [
    `Divide this field into management zones based on crop health.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],

  // ENVI Modeler Workflows
  [
    `Build an ENVI Modeler workflow that stacks bands, calculates NDVI, and then classifies vegetation health.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Create an ENVI Modeler workflow that orthorectifies an image and then pan-sharpens it. TO keep bands aligned, run pan sharpening first, then ortho.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Build an ENVI Modeler workflow that runs change detection using spectral indices between two dates and converts the results to polygons.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Create an ENVI Modeler workflow that applies atmospheric correction using QUAC and then computes multiple spectral indices.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Build an ENVI Modeler workflow that classifies land cover with a machine learning model and then cleans up the results.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],
  [
    `Create an ENVI Modeler workflow that mosaics several scenes together and reprojects the output to web mercator.`,
    `Here's the path to my data: "C:\\my\\dataset\\image.tif"`,
  ],

  // Workflow explainers (how-to / conceptual)
  `Can you explain how to stack data using ENVI?`,
  `Can you explain how change detection using machine learning works in ENVI?`,
  `How do I downsample part of an image in ENVI?`,
  `Can you walk me through a generic change detection workflow in ENVI?`,
  `How can I process imagery with deep learning models in ENVI?`,
  `Can you explain how image classification with machine learning works in ENVI?`,
  `How do I register two images together in ENVI?`,
  `Can you explain the orthorectification workflow in ENVI?`,
  `What is a dataset index and how does ENVI use it?`,
  `How does SARscape classify amplitude data?`,
  `Can you explain amplitude tracking in SARscape?`,
  `How does SARscape combine coherence and amplitude to classify a scene?`,
  `Can you explain a coherence change detection timeline with power in SARscape?`,
  `How do I build a coherence change detection timeline in SARscape?`,
  `Can you explain how differential InSAR displacement works in SARscape?`,
  `How can I detect floods using SARscape?`,
  `Can you explain how to generate a DEM from InSAR in SARscape?`,
  `How do I process a single SAR intensity image in SARscape?`,
  `Can you explain how to build a SAR intensity time series in SARscape?`,
  `How does SARscape detect moving targets using inverse SAR?`,
  `Can you explain how to visualize moving targets in SARscape?`,
  `How can I create an RGB composite from multi inverse coherence change detection in SARscape?`,
  `Can you explain how SARscape detects oil spills?`,
  `How does ship detection work in SARscape?`,
  `Can you explain how to generate a stereo DEM in SARscape?`,
];
