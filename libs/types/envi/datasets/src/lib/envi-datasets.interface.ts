export interface ENVIRaster {
  auxiliary_url?: string[];
  dataset_index?: number;
  factory: 'URLRaster';
  url: string;
}

export interface ENVIRasterSeries {
  factory: 'URLRasterSeries';
  url: string;
}
export interface ENVIROI {
  factory: 'URLROI';
  url: string;
}

export interface ENVISpectralLibrary {
  auxiliary_url: string;
  factory: 'URLSpectralLibrary';
  url: string;
}

export interface ENVIVector {
  auxiliary_url: string[];
  factory: 'URLVector';
  url: string;
}
