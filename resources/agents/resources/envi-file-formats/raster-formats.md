# ENVI Supported Raster Formats

This document lists all raster file formats supported by ENVI for remote sensing and image analysis.

| Format | Read | Write | Remote | Open Method | File Extension |
|--------|------|-------|--------|-------------|----------------|
| ADS40 (TIFF) | • |  |  | File > Open As > Optical Sensors > ADS40/ADS80 | .tif |
| ADS80 (TIFF) | • |  |  | File > Open As > Optical Sensors > ADS40/ADS80 | .tif |
| AIRSAR (JPL Stokes matrix format) | • |  |  | See Radar Tools | .stk |
| AlSat-2A (TIFF) | • |  |  | File > Open | metadata.dim |
| AlSat-2B (TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > DMC | metadata.dim |
| ALOS Level-1A and 1B1 AVNIR-2 | • |  |  | File > Open As > Optical Sensors > ALOS > AVNIR-2 | img* |
| ALOS Level-1A and 1B1 PRISM | • |  |  | File > Open As > Optical Sensors > ALOS > PRISM | img* |
| ALOS Level-1B2 AVNIR-2 | • |  |  | File > Open | hdr*.txt |
| ALOS Level-1B2 PRISM | • |  |  | File > Open | hdr*.txt |
| ALOS-1 and -2 PALSAR (CEOS) | • |  |  | File > Open, File > Open As > Radar Sensors > ALOS-PALSAR | VOL* or LED* |
| Analysis Ready Data (ARD) (DigitalGlobe/Maxar) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar | *-request.json |
| ArcGIS Image Services (JPEG, PNG, TIFF) | • |  | • | File > Open Remote Dataset, File > Remote Connection Manager | .jpg, .png, .tif |
| ArcGIS Mosaic datasets (JPEG, PNG, TIFF) | • |  | • | File > Open Remote Dataset, File > Remote Connection Manager | .jpg, .png, .tif |
| ArcView Raster (BIL) | • | • |  | File > Open As > GIS Formats > ArcView Raster | .bil |
| ASCII (x,y,z and gridded) | • | • |  | File > Open As > Generic Formats > ASCII | |
| ASTER Level-1A and 1B (HDF-EOS) | • |  |  | File > Open, File > Open As > Optical Sensors > EOS > ASTER | .hdf |
| ASTER Level-2 (HDF-EOS) | • |  |  | File > Open, File > Open As > Optical Sensors > EOS > ASTER | .hdf |
| ASTER Level-3 DEM (HDF-EOS) | • |  |  | File > Open, File > Open As > Optical Sensors > EOS | .hdf |
| ATSR (GBT, GBROWSE, GSST) | • |  |  | File > Open As > Optical Sensors > ATSR | |
| AVHRR KLMN Level-1B | • |  |  | File > Open As > Optical Sensors > AVHRR > KLMN Level 1b | .1b |
| AVHRR SHARP (ESA) | • |  |  | File > Open As > Optical Sensors > AVHRR > SHARP | dat* |
| AVHRR Quorum (HRPT) | • |  |  | File > Open As > Optical Sensors > AVHRR > Quorum | .n1* |
| AVIRIS | • |  |  | File > Open | *_img.txt, *.rfl |
| BigTIFF | • | • |  | File > Open | .tif |
| Binary | • |  |  | File > Open As > Generic Formats > Binary | |
| Bitmap (BMP) | • |  |  | File > Open | .bmp |
| BlackSky | • |  |  | File > Open, File > Open As > Optical Sensors > BlackSky | *-metadata.json |
| CADRG | • | • |  | File > Open, File > Open As > Military Formats > CADRG | a.toc |
| Cartosat-1 (TIFF) | • |  |  | File > Open | .tif |
| CIB | • | • |  | File > Open, File > Open As > Military Formats > CIB | a.toc |
| Cloud Optimized GeoTIFF | • | • |  | Open Remote Dataset dialog | .tif |
| COSMO-SkyMed Level-1A SCS, 1B DGM, 1C GEC, 1D GTC (HDF5) | • |  |  | File > Open As > Radar Sensors > COSMO-SkyMed | .h5 |
| Deimos-1 | • |  |  | File > Open | .dim |
| Deimos-2 | • |  |  | File > Open | .dim |
| DMC UK-DMC Level-1R, 1T, 2R (TIFF) | • |  |  | File > Open As > Optical Sensors > DMC | .dim |
| DMC UK-DMC2 Level-1R, 1T, 2R (TIFF) | • |  |  | File > Open As > Optical Sensors > DMC | .dim |
| DMC ALSAT-1 Level-1R, 1T (TIFF) | • |  |  | File > Open As > Optical Sensors > DMC | .dim |
| DMC Beijing-1 Level-1R, 1T (TIFF) | • |  |  | File > Open As > Optical Sensors > DMC | .dim |
| DMC NigeriaSat-1 Level-1R, 1T (TIFF) | • |  |  | File > Open As > Optical Sensors > DMC | .dim |
| DMC NigeriaSat-2 Level-1R, 1T (TIFF) | • |  |  | File > Open As > Optical Sensors > DMC | .dim |
| DMSP | • |  |  | File > Open As > Optical Sensors > DMSP (NOAA) | .tir, .vis |
| DPPDB (NITF) | • |  |  | File > Open | .ntf |
| DTED Level-0, 1, 2 | • | • |  | File > Open | .dt* |
| DubaiSat-1 (RAW, TIFF) | • |  |  | File > Open | raw, .tif |
| DubaiSat-2 (TIFF) | • |  |  | File > Open | .xml |
| ECRG | • |  |  | File > Open | toc.xml |
| ECW (Windows only) | • |  |  | File > Open As > GIS Formats > ECW | .ecw |
| EMIT (Level 1B, Level 2A) | • |  |  | File > Open, File > Open As > Optical Sensors > International Space Station > EMIT 1B/2A Hyperspectral | .nc |
| EnMAP (Level-1B, Level-1C, Level-2A) | • |  |  | File > Open, File > Open As > Optical Sensors > EnMAP | *_metadata.xml |
| ENVI classification file | • | • |  | File > Open | .dat, .img |
| ENVI feature counting file | • | • |  | File > Open | .efc |
| ENVI meta file | • | • |  | File > Open | |
| ENVI raster | • | • |  | File > Open | .dat, .img |
| Envisat AATSR Level-1B and 2 | • |  |  | File > Open As > Optical Sensors > Envisat > AATSR | ats*.n1 |
| Envisat ASAR Level-1B | • |  |  | File > Open As > Optical Sensors > Envisat > ASAR | asa*.n1 |
| Envisat MERIS Level-1B and 2 | • |  |  | File > Open As > Optical Sensors > Envisat > MERIS | mer*.n1 |
| EO-1 ALI (HDF4) | • |  |  | File > Open, File > Open As > Optical Sensors > EO-1 > HDF4 | _hdf.l1g |
| EO-1 ALI Level-1T (TIFF) |  |  |  | File > Open As > Optical Sensors > EO-1 > GeoTIFF | *_mtl.tif, *_mtl_l1t.tif, *_mtl_l1gst.txt |
| EO-1 Hyperion Level-1R (HDF) | • |  |  | File > Open As > Optical Sensors > EO-1 > HDF4 | .l1r |
| EO-1 Hyperion Level-1T (TIFF) | • |  |  | File > Open As > Optical Sensors > EO-1 > GeoTIFF | *_l1t.tif |
| ER Mapper (unsigned integer data) | • | • |  | File > Open As > GIS Formats > ER Mapper | .ers |
| ERDAS IMAGINE | • | • |  | File > Open As > GIS Formats > ERDAS | .ige, .img |
| EROS A Level-1A | • |  |  | File > Open As > Optical Sensors > EROS > Level 1A | .1a |
| EROS A Level-1B (TIFF) | • |  |  | File > Open As > Optical Sensors > EROS > Level 1B (GeoTIFF) | .1b |
| ERS-1 Level-0, SLC (CEOS generic) | • |  |  | File > Open As > Radar Sensors > ERS | dat*.001 |
| ERS-2 Level-0, SLC (CEOS generic) | • |  |  | File > Open As > Radar Sensors > ERS | dat*.001 |
| Esri GRID (single band) | • |  |  | File > Open As > GIS Formats > ESRI GRID | hdr.adf |
| Esri GRID Stack 7.x (multispectral) | • |  |  | File > Open As > GIS Formats > ESRI GRID | hdr.adf |
| FormoSat-2 | • |  |  | File > Open As > Optical Sensors > FormoSat > FormoSat-2 | .dim |
| FormoSat-5 | • |  |  | File > Open As > Optical Sensors > FormoSat > FormoSat-5 | .dim |
| Gaofen-1 | • |  |  | File > Open As > Optical Sensors > CRESDA > GF-1 | *.xml |
| Gaofen-2 | • |  |  | File > Open As > Optical Sensors > CRESDA > GF-2 | *.xml |
| GeoEye-1 (NITF, TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > GeoEye-1 PVL | .pvl, *_metadata.txt |
| GeoEye-1 (DigitalGlobe/Maxar format) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > GeoEye-1 Tiled (.TIL) | .til |
| GIF | • |  |  | File > Open | .gif |
| GeoTIFF | • | • |  | File > Open | .tif |
| GOES-16 (NetCDF-4) | • |  |  | File > Open | .nc |
| GOES-17 (NetCDF-4) | • |  |  | File > Open | .nc |
| Göktürk-1 and Göktürk-2 (TIFF) | • |  |  | File > Open | package.xml |
| GRIB-1 | • |  |  | File > Open | .grb |
| GRIB-2 | • |  |  | File > Open | .grb2 |
| GRUS L1C and L2A | • |  |  | File > Open As > Optical Sensors > GRUS | .json |
| HDF-EOS | • |  |  | File > Open As > Optical Sensors > EOS > ASTER/MODIS | .hdf, .he5 |
| HDF4 | • |  |  | File > Open, File > Open As > Scientific Formats > HDF4 | .hdf |
| HDF5 | • |  |  | File > Open, File > Open As > Scientific Formats > HDF5 | .h5, .hdf5 |
| Himawari-8 (NetCDF-3) | • |  |  | File > Open As > Optical Sensors > Himawari-8 | .nc |
| IKONOS (NITF, TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > IKONOS | *_metadata.txt |
| ISIS3 | • |  |  | File > Open As > Generic Formats > ISIS3 | .lbl, .cub |
| JERS-1 | • |  |  | File > Open As > Radar Sensors > JERS | .dat |
| Jilin-1 | • |  |  | File > Open, File > Open As > Optical Sensors > Jilin-1 | *_meta.xml |
| JPEG | • |  |  | File > Open | .jpg, .jpeg |
| JPEG2000 | • | • | • | File > Open | .jp2, .j2k |
| JPIP (JPEG2000) | • |  | • | File > Open Remote Dataset | .jp2, .j2c, .jpx |
| KOMPSAT-2 (TIFF) | • |  |  | File > Open | .xml |
| KOMPSAT-3 (TIFF) | • |  |  | File > Open | .xml |
| KOMPSAT-3A (TIFF) | • |  |  | File > Open | .xml |
| Landsat 4, 5 TM files with Metadata (TIFF) | • |  |  | File > Open | *_mtl.txt, *_wo.txt, .met |
| Landsat 7 ETM+ files with Metadata (TIFF) | • |  |  | File > Open | *_mtl.txt, *_wo.txt, .met |
| Landsat 7 Fast Pan data, Band 8 | • |  |  | File > Open As > Optical Sensors > Landsat > Fast | *_hpn.fst |
| Landsat 7 Fast Thermal data, Bands 61-62 | • |  |  | File > Open As > Optical Sensors > Landsat > Fast | *_htm.fst |
| Landsat 7 Fast VNIR/SWIR data, Bands 1-5 and 7 | • |  |  | File > Open As > Optical Sensors > Landsat > Fast | *_hrf.fst |
| Landsat 8 OLI/TIRS files with Metadata (TIFF) | • |  |  | File > Open | *_mtl.txt, .xml |
| Landsat 9 OLI/TIRS files with Metadata (TIFF) | • |  |  | File > Open | *_mtl.txt, .xml |
| Landsat ACRES CCRS | • |  |  | File > Open As > Optical Sensors > Landsat > ACRES > CCRS | imag*.dat |
| Landsat Analysis Ready Data (ARD) | • |  |  | File > Open | *_mtl.txt, .xml |
| Landsat ESA CEOS | • |  |  | File > Open As > Optical Sensors > Landsat > ESA CEOS | dat*.xxx |
| Landsat HDF4 | • |  |  | File > Open As > Optical Sensors > Landsat > HDF4 | .hdf |
| Landsat L2SP | • |  |  | File > Open > *_MTL.txt | .txt |
| Landsat Level-3 Products | • |  |  | File > Open | .xml |
| Landsat MRLC | • |  |  | File > Open As > Optical Sensors > Landsat > MRLC | .dda |
| Landsat NLAPS | • |  |  | File > Open As > Optical Sensors > Landsat > NLAPS | .h* |
| Landsat TM Fast | • |  |  | File > Open As > Optical Sensors > Landsat > Fast | header.dat |
| LAS LiDAR versions 1.0 through 1.4 | • |  |  | See Open LAS Format LiDAR Files and 3D LiDAR Viewer | .las |
| Legion (DigitalGlobe/Maxar) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar Legion | .til, .xml |
| MASTER (HDF4) | • |  |  | File > Open As > Thermal Sensors > MASTER | .hdf |
| Meteosat 2nd generation, Level 1.5 | • |  |  | File > Open As > Optical Sensors > Meteosat | .nat |
| MIE4NITF | • |  |  | File > Open As > Military Formats > MIE4NITF | .ntf, .nitf, .nsf, .r0 |
| MODIS Level-1B through 4 (HDF-EOS) | • |  |  | File > Open, File > Open As > Optical Sensors > EOS > MODIS | .hdf |
| MrSID (Windows and Linux only) | • |  |  | File > Open | .sid |
| Multi-page TIFF | • |  |  | File > Open As > Series or File > Open | .tif |
| NASA PACE (Plankton, Aerosol, Cloud, Ocean Ecosystem) | • |  |  | File > Open | .nc |
| NetCDF-3 | • |  |  | File > Open As > Scientific Formats > NetCDF-3 | .nc, .cdf |
| NetCDF-4 | • |  |  | File > Open As > Scientific Formats > NetCDF-4 | .nc |
| NigeriaSat-1 (TIFF) | • |  |  | File > Open | .dim |
| NigeriaSat-2 (TIFF) | • |  |  | File > Open | .dim |
| NITF 1.1, 2.0, 2.1 | • | • |  | File > Open | .ntf, .nitf, .nsf, .r0 |
| NSIF 1.0 | • | • |  | File > Open | .nsf |
| NPP VIIRS (HDF5) | • |  |  | File > Open | .h5 |
| OGC WCS (GIF, JPEG, PNG, TIFF) | • |  | • | File > Open Remote Dataset, File > Remote Connection Manager | .gif, .jpg, .jpeg, .png, .tif |
| OGC WMS (GIF, JPEG, PNG, TIFF) | • |  | • | File > Open Remote Dataset, File > Remote Connection Manager | .gif, .jpg, .jpeg, .png, .tif |
| OrbView-3 (NITF, TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > OrbView-3 | .pvl |
| PCI | • | • |  | File > Open As > GIS Formats > PCI | .pix |
| PDS | • |  |  | File > Open | .lb1, .pds |
| PDS4 | • |  |  | File > Open As > Generic Formats > PDS4 | .img |
| PeruSat-1 | • |  |  | File > Open, File > Open As > Optical Sensors > PeruSat | dim*.xml |
| PICT | • |  |  | File > Open As > Generic Formats > PICT | .pic |
| PlanetScope (NITF, TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > Planet > PlanetScope | *_metadata.xml, *_metadata_clip.xml, *_metadata.json |
| Pleiades-HR 1A, 1B Primary and Ortho | • |  |  | File > Open, File > Open As > Optical Sensors > Airbus > Pleiades > DIMAP (*.DIM) | dim*.xml |
| Pleiades-HR DIMAP V1 | • |  |  | File > Open | PHRDIMAP.xml |
| Pleiades-HR DIMAP V2 (JPEG2000, TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > Airbus > Pleiades > DIMAP (.DIM) | dim*.xml |
| Pleiades-HR Mosaic Tiles | • |  |  | File > Open, File > Open As > Optical Sensors > Airbus > Pleiades > Tiled (.TIL) | .til |
| Pleiades-NEO | • |  |  | File > Open, File > Open As > Optical Sensors > Airbus > Pleiades-NEO > DIMAP (.XML) | dim*.xml |
| PNG | • |  |  | File > Open | .png |
| PRISMA | • |  |  | File > Open As > Optical Sensors > PRISMA (ASI) | .he5 |
| Proba-V (HDF5) | • |  |  | File > Open, File > Open As > Optical Sensors > Proba-V | .h5 |
| QuickBird (DigitalGlobe format) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > QuickBird | .til |
| QuickBird (NITF, TIFF) | • |  |  | File > Open | .ntf, .tif |
| RADARSAT-1 (CEOS) | • |  |  | File > Open As > Radar Sensors > RADARSAT | dat*.001 |
| RADARSAT-2 (TIFF) | • |  |  | File > Open As > Radar Sensors > RADARSAT | .tif |
| RapidEye Level-1B Basic (NITF, TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > Planet > RapidEye | *_metadata.xml |
| RapidEye Level-3A Ortho (NITF, TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > Planet > RapidEye | .ntf, .tif |
| RapidEye Level-3B Area-based Ortho (TIFF) | • |  |  | File > Open, File > Open As > Optical Sensors > Planet > RapidEye | .tif |
| RASAT | • |  |  | File > Open | package.xml |
| ResourceSat-1 Fast | • |  |  | File > Open As > Optical Sensors > IRS > Fast | header.dat |
| ResourceSat-1 Super Structured | • |  |  | File > Open As > Optical Sensors > IRS > Super Structured | leader* |
| ResourceSat-2 (HDF5) | • |  |  | File > Open | .h5 |
| SeaWiFS LAC 1B, 2A, 2B (CEOS) | • |  |  | File > Open As > Optical Sensors > SeaWiFS > CEOS | image* |
| SeaWiFS Level-1A, 1B (HDF4) | • |  |  | File > Open As > Optical Sensors > SeaWiFS > HDF4 | *.l1a*, *.l1b* |
| Sentinel-1 GRD | • |  |  | File > Open, File > Open As > Radar Sensors > Sentinel-1 | manifest.safe |
| Sentinel-1 SLC | • |  |  | File > Open, File > Open As > Radar Sensors > Sentinel-1 | manifest.safe |
| Sentinel-2 | • |  |  | File > Open, File > Open As > Optical Sensors > European Space Agency > Sentinel-2 | *.xml |
| Sentinel-3 | • |  |  | File > Open, File > Open As > Optical Sensors > European Space Agency > Sentinel-3 OLCI/SLSTR | *.xml |
| SICD (NITF) 1.1, 1.2, 1.3 | • |  |  | File > Open, File > Open As > Radar Formats > SICD | .ntf |
| SIDD (NITF) 2.0 | • |  |  | File > Open | .ntf |
| SIR-C / X-SAR | • |  |  | See Radar Tools | .cdp |
| SkySat | • |  |  | File > Open, File > Open As > Optical Sensors > Planet > SkySat | *_metadata.json |
| SkySat legacy products | • |  |  | File > Open As > Optical Sensors > Planet > SkySat Legacy | *_metadata.txt |
| SPOT ACRES | • |  |  | File > Open As > Optical Sensors > Airbus > SPOT > ACRES SPOT | .dat |
| SPOT CAP | • |  |  | File > Open As > Optical Sensors > Airbus > SPOT > SPOT | .dat |
| SPOT GeoSPOT | • |  |  | File > Open As > Optical Sensors > Airbus > SPOT > GeoSPOT | .tif, .bil |
| SPOT Level-1A, 2A, 1B | • |  |  | File > Open As > Optical Sensors > Airbus > SPOT > SPOT | .dat |
| SPOT mosaic tiles | • |  |  | File > Open | .til |
| SPOT 2-5 DIMAP V1 (BIL, TIFF) | • |  |  | File > Open As > Optical Sensors > Airbus > SPOT > DIMAP | metadata.dim, *.xml |
| SPOT 6 DIMAP V2 (JPEG2000, TIFF) | • |  |  | File > Open | DIM*.xml |
| SPOT 7 DIMAP V2 (JPEG2000, TIFF) | • |  |  | File > Open | DIM*.xml |
| SPOT SISA | • |  |  | File > Open As > Optical Sensors > Airbus > SPOT > SPOT | .dat |
| SPOT Vegetation (HDF4) | • |  |  | File > Open As > Optical Sensors > Airbus > SPOT > Vegetation | .hdf |
| SRF | • |  |  | File > Open As > Generic Formats > SRF | .srf |
| SRTM DEM | • |  |  | File > Open As > Digital Elevation > SRTM DEM | .hgt |
| SSOT DIMAP V2 | • |  |  | File > Open | metadata.dim |
| STANAG 4676 Track Points, Edition B | • |  |  | File > Open As > Military Formats > STANAG 4676 Track Points | .xml |
| SuperView-1 | • |  |  | File > Open, File > Open As > Optical Sensors > SuperView-1 | .xml |
| Tanager | • |  |  | File > Open, File > Open As > Optical Sensors > Planet > Tanager | .hdf5 |
| TerraSAR-X | • |  |  | File > Open As > Radar Sensors > TerraSAR-X | .xml |
| THEOS-2 | • |  |  | File > Open, File > Open As > Optical Sensors > THEOS2 | dim*.xml |
| TIFF | • | • |  | File > Open | .tif |
| TIMS | • |  |  | File > Open As > Thermal Sensors > TIMS | |
| TOPSAR Correlation Image, Incidence Angle, DEM | • |  |  | File > Open As > Radar Sensors > TOPSAR | |
| TripleSat (DIMAP) | • |  |  | File > Open, File > Open As > Optical Sensors > TripleSat | *.dim |
| TripleSat (XML) | • |  |  | File > Open, File > Open As > Optical Sensors > TripleSat | *.xml |
| UrtheCast Theia | • |  |  | File > Open, File > Open As > Optical Sensors > UrtheCast Theia | *.xml |
| USGS DOQ | • |  |  | File > Open As > GIS Formats > USGS > DOQ | .tif |
| USGS DRG | • |  |  | File > Open As > GIS Formats > USGS > DRG | .tif |
| USGS Native DEM | • |  |  | File > Open As > Digital Elevation > USGS DEM | |
| USGS SDTS DEM | • |  |  | File > Open As > Digital Elevation > USGS SDTS DEM | |
| VNREDSat-1 | • |  |  | File > Open | metadata.dim |
| WorldView-1 (DigitalGlobe format) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > WorldView-1 | .til |
| WorldView-1 (NITF, TIFF) | • |  |  | File > Open | .ntf, .tif |
| WorldView-2 (DigitalGlobe format) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > WorldView-2 | .til |
| WorldView-2 (NITF, TIFF) | • |  |  | File > Open | .ntf, .tif |
| WorldView-3 (DigitalGlobe format) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > WorldView-3 | .til |
| WorldView-3 (NITF) | • |  |  | File > Open | .ntf |
| WorldView-3 (TIFF) | • |  |  | File > Open | .tif |
| WorldView-4 (DigitalGlobe format) | • |  |  | File > Open, File > Open As > Optical Sensors > DigitalGlobe/Maxar > WorldView-4 | .til |
| WorldView-4 (NITF, TIFF) | • |  |  | File > Open | .ntf, .tif |
| Wyvern Dragonette | • |  |  | File > Open, File > Open As > Optical Sensors > Wyvern | .json |
| XWD | • |  |  | File > Open As > Generic Formats > XWD | .xwd |
| Zhuhai-1 | • |  |  | File > Open As > Optical Sensors > Zhuhai-1 | *_meta.xml |
| Ziyuan-1 ZY-1-02C | • |  |  | File > Open As > Optical Sensors > CRESDA > ZY-1 | *.orientation.xml, *.xml, *-MUX.xml, *-PAN.xml |
| Ziyuan-1 ZY-1-02D (ZY1E) | • |  |  | File > Open As > Optical Sensors > CRESDA > ZY-1 | *.xml |
| Ziyuan-3A | • |  |  | File > Open As > Optical Sensors > CRESDA > ZY-3 | *.orientation.xml, *.xml, *-NAD.xml |

**Note:** A separate NITF Module license is required to view NITF files; contact your sales representative for more information.

**Legend:**
- • = Feature supported
- Remote = Can be opened through Open Remote Dataset dialog and Remote Connection Manager
