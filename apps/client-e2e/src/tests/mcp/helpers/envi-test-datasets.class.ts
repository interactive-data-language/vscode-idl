import { basename, dirname, join } from 'path';

import { IDL_DIR } from './../../../main';

/**
 * Class that helps get dehydrated flavors of different ENVI data
 * types based on the files that we ship with ENVI
 */
export class ENVITestDatasets {
  /**
   * Returns ENVI's install location from the IDL bin directory
   *
   * Throws an error if ENVI is not found
   */
  static getENVIDir() {
    /** If ENVI + IDL, go up 3 folders from the bin directory */
    const enviDir = dirname(dirname(dirname(IDL_DIR)));

    // make sure we have ENVI install location
    if (!basename(enviDir).toLowerCase().startsWith('envi')) {
      throw new Error('ENVI not installed');
    }

    // return the folder ENVI is in
    return enviDir;
  }

  /**
   * Returns a dehydrated raster that contains multiple datasets
   */
  static multiRaster(dataset_index?: number) {
    /** Get ENVI install */
    const envi = this.getENVIDir();

    /** Make base dataset */
    const dataset = {
      factory: 'URLRaster',
      url: join(envi, 'data', 'NITFExamples', 'MultiSegmentExample.ntf'),
    };

    // see if we need to add a dataset index
    if (typeof dataset_index !== 'undefined') {
      dataset['dataset_index'] = dataset_index;
    }

    // add the dataset
    return dataset;
  }

  /**
   * Returns a dehydrated raster
   */
  static raster() {
    /** Get ENVI install */
    const envi = this.getENVIDir();

    return {
      factory: 'URLRaster',
      url: join(envi, 'data', 'qb_boulder_msi'),
      auxiliary_url: [join(envi, 'data', 'qb_boulder_msi.hdr')],
    };
  }

  /**
   * Returns a dehydrated raster series
   */
  static rasterSeries() {
    /** Get ENVI install */
    const envi = this.getENVIDir();

    return {
      factory: 'URLRasterSeries',
      url: join(envi, 'data', 'time_series', 'AirTemp.series'),
    };
  }

  /**
   * Returns a dehydrated ROI
   */
  static roi() {
    /** Get ENVI install */
    const envi = this.getENVIDir();

    return {
      factory: 'URLROI',
      url: join(envi, 'data', 'qb_boulder_roi.xml'),
    };
  }

  /**
   * Returns a dehydrated spectral library
   */
  static spectralLibrary() {
    /** Get ENVI install */
    const envi = this.getENVIDir();

    return {
      factory: 'URLSpectralLibrary',
      url: join(envi, 'resource', 'speclib', 'veg_lib', 'veg_1dry.sli'),
      auxiliary_url: join(
        envi,
        'resource',
        'speclib',
        'veg_lib',
        'veg_1dry.sli',
      ),
    };
  }

  /**
   * Returns a dehydrated vector (shapefile)
   */
  static vector() {
    /** Get ENVI install */
    const envi = this.getENVIDir();

    return {
      factory: 'URLVector',
      url: join(envi, 'data', 'natural_earth_vectors', 'coastlines.shp'),
      auxiliary_url: [
        join(envi, 'data', 'natural_earth_vectors', 'coastlines.dbf'),
        join(envi, 'data', 'natural_earth_vectors', 'coastlines.shx'),
        join(envi, 'data', 'natural_earth_vectors', 'coastlines.prj'),
      ],
    };
  }
}
