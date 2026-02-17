import { z } from 'zod';

/**
 * Returns an ENVI Spectral Signature object for MCP
 */
export function MCP_ENVISpectralSignature() {
  return z.object({
    factory: z
      .string()
      .default('ENVISpectralSignature')
      .refine((val) => val.toLowerCase() === 'envispectralsignature', {
        message: 'factory must be "ENVISpectralSignature" (case-insensitive)',
      })
      .describe(
        'This value should be "ENVISpectralSignature" (case-insensitive)'
      ),
    name: z.string().describe('The name of the spectral signature'),
    reflectance_scale_factor: z
      .string()
      .describe(
        'Enter the value that, when divided into your data, would scale it from 0-1 reflectance. For example, if the value of 10,000 in your data represents a reflectance value of 1.0, enter a reflectance scale factor of 10,000.'
      ),
    y_range: z
      .array(z.number())
      .length(2)
      .describe(
        'Range of the data when scaled by the reflectance scale factor, should be [0,1].'
      ),
    spectrum: z
      .array(z.number())
      .describe(
        'The values of the spectrum. Should be units of surface reflectance, but may not depending on the library source (i.e. user creates from raster).'
      ),
    wavelength_units: z
      .enum(['Micrometers', 'Nanometers', 'nm', 'Wavenumber', 'GHz', 'MHz'])
      .describe('The wavelengths of each spectrum measurement'),
    wavelengths: z
      .array(z.number())
      .describe(
        'The wavelengths of each value of the spectrum, used to resample spectra to one another.'
      ),
  });
}
