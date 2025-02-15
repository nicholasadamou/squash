import * as avif from '@jsquash/avif';
import * as jpeg from '@jsquash/jpeg';
import * as jxl from '@jsquash/jxl';
import * as png from '@jsquash/png';
import * as webp from '@jsquash/webp';

import type { OutputType } from '../../types';
import type { JpegEncodeOptions, JxlEncodeOptions, WebpEncodeOptions } from '../../types/encoders';

import { ensureWasmLoaded } from './wasm';

/**
 * Decode an image file buffer to ImageData based on the source type.
 * @param sourceType - The type of the image (e.g., avif, jpeg, png).
 * @param fileBuffer - The ArrayBuffer containing the image data.
 * @returns Decoded ImageData.
 */
export async function decode(sourceType: string, fileBuffer: ArrayBuffer): Promise<ImageData> {
	await ensureWasmLoaded(sourceType as OutputType);

	try {
		const decoders = {
			avif: avif.decode,
			jpeg: jpeg.decode,
			jpg: jpeg.decode,
			jxl: jxl.decode,
			png: png.decode,
			webp: webp.decode,
		};

		type DecoderType = keyof typeof decoders;

		function isDecoderType(type: string): type is DecoderType {
			return type in decoders;
		}

		if (!isDecoderType(sourceType)) {
			throw new Error(`Unsupported source type: ${sourceType}`);
		}

		const decodeFunc = decoders[sourceType];
		if (!decodeFunc) {
			throw new Error(`Unsupported source type: ${sourceType}`);
		}

		return await decodeFunc(fileBuffer);
	} catch (error) {
		console.error(`Failed to decode ${sourceType} image:`, error);
		throw new Error(`Failed to decode ${sourceType} image`);
	}
}

/**
 * Encode ImageData to a specific output format.
 * @param outputType - The desired output type (e.g., avif, jpeg, png).
 * @param imageData - The ImageData to be encoded.
 * @param options - Compression options for encoding.
 * @returns An ArrayBuffer containing the encoded image data.
 */
export async function encode<T extends OutputType>(
	outputType: T,
	imageData: ImageData,
	options: JpegEncodeOptions | JxlEncodeOptions | WebpEncodeOptions
): Promise<ArrayBuffer> {
	await ensureWasmLoaded(outputType);

	try {
		switch (outputType) {
			case 'avif':
				return await avif.encode(imageData);
			case 'jpeg':
				return await jpeg.encode(imageData, options as JpegEncodeOptions);
			case 'jxl':
				return await jxl.encode(imageData, options as JxlEncodeOptions);
			case 'png':
				return await png.encode(imageData);
			case 'webp':
				return await webp.encode(imageData, options as WebpEncodeOptions);
			default:
				throw new Error(`Unsupported output type: ${outputType}`);
		}
	} catch (error) {
		console.error(`Failed to encode to ${outputType}:`, error);
		throw new Error(`Failed to encode to ${outputType}`);
	}
}
