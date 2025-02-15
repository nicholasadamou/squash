import { zipSync } from 'fflate';

import type { ImageFile } from '../types';

/**
 * Downloads a single image file.
 * @param image - The image file to be downloaded. Must have a blob and output type.
 */
export function downloadImage(image: ImageFile) {
	// Ensure the image has a valid blob and output type before proceeding.
	if (!image.blob || !image.outputType) return;

	// Create a temporary anchor element for the download.
	const link = document.createElement('a');

	// Create a downloadable URL for the image blob.
	link.href = URL.createObjectURL(image.blob);

	// Set the download filename to the original file name with the new output format extension.
	link.download = `${image.file.name.split('.')[0]}.${image.outputType}`;

	// Trigger the download.
	link.click();

	// Revoke the object URL to release memory.
	URL.revokeObjectURL(link.href);
}

/**
 * Downloads all completed images as a single ZIP archive.
 * @param images - Array of image files to be included in the ZIP archive. Only images with status 'complete' and a valid blob will be added.
 */
export async function downloadAllImages(images: ImageFile[]) {
	const zipFiles: Record<string, Uint8Array> = {};

	// Type guard to check if an image has a blob.
	function hasBlob(image: ImageFile): image is ImageFile & { blob: Blob } {
		return image.blob !== undefined;
	}

	function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as ArrayBuffer);
			reader.onerror = reject;
			reader.readAsArrayBuffer(blob);
		});
	}

	// Filter images to include only those that are complete and have a valid blob and output type.
	const filteredImages = images.filter(image => image.status === 'complete' && hasBlob(image));

	// Return early if no images are complete.
	if (filteredImages.length === 0) return;

	// Add each filtered image to the ZIP archive.
	for (const image of filteredImages) {
		const fileName = `${image.file.name.split('.')[0]}.${image.outputType}`;
		zipFiles[fileName] = new Uint8Array(await blobToArrayBuffer(image.blob!));
	}

	// Generate the ZIP file as a Blob.
	const zipped = zipSync(zipFiles); // Create the ZIP file as a Uint8Array
	const zipBlob = new Blob([zipped], { type: 'application/zip' });

	// Create a temporary anchor element for the ZIP download.
	const link = document.createElement('a');

	// Create a downloadable URL for the ZIP blob.
	link.href = URL.createObjectURL(zipBlob);

	// Set the download filename as "images.zip".
	link.download = `images.zip`;

	// Trigger the download.
	link.click();

	// Revoke the object URL to release memory.
	URL.revokeObjectURL(link.href);
}
