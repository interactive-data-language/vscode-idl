export const DESCRIPTION = `
Using ENVI, returns information about a variety of datasets. 

Supports nearly any imagery or remote sensing format (ENVI, TIFF, NITF, and many more), vector, ENVI ROIs, spectral libraries, ONNX models configured for ENVI, and Machine Learning models created with ENVI.

Metadata returned varies by type, but here is a brief summary:

- Raster: Image metadata such as wavelength, bands names, type of raster, data modality, spatial extents

- Spectral library: Description, spectra names, wavelengths, wavelength units

- ENVI ONNX Model: Description, class names, type of model (object detection, pixel segmentation), and expected bands for input data

- Machine Learning Model: Description, class names, model performance, and expected raster input
`;
