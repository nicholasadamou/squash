import type { FormatQualitySettings } from '../types';

/**
 * Default quality settings for different image formats.
 * These settings define the default compression quality to be used for each supported format.
 * Quality values typically range from 1 to 100:
 * - Higher values result in better image quality but larger file sizes.
 * - Lower values reduce file size at the cost of image quality.
 */
export const DEFAULT_QUALITY_SETTINGS: FormatQualitySettings = {
	/**
	 * AVIF format default quality (50)
	 * - Balanced setting for good quality and compression.
	 * - AVIF supports high compression efficiency, so a lower default is acceptable.
	 */
	avif: 50,

	/**
	 * JPEG format default quality (75)
	 * - Standard quality setting for JPEG.
	 * - Provides a good balance between file size and image fidelity.
	 */
	jpeg: 75,

	/**
	 * JXL (JPEG XL) format default quality (75)
	 * - JPEG XL is a modern format with high compression efficiency.
	 * - The default setting aims for good quality and moderate file size.
	 */
	jxl: 75,

	/**
	 * WebP format default quality (75)
	 * - WebP offers better compression than JPEG while maintaining image quality.
	 * - The default quality of 75 ensures a good balance for most use cases.
	 */
	webp: 75,
};
