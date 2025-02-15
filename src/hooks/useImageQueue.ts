import * as React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';

import type { ImageFile, OutputType, CompressionOptions } from '../types';

import { decode, encode } from '../files/decoders';

import { getFileType } from '../files/file';

export function useImageQueue(
	options: CompressionOptions,
	outputType: OutputType,
	setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>
) {
	const MAX_PARALLEL_PROCESSING = 3;
	const [queue, setQueue] = useState<string[]>([]);
	const processingCount = useRef(0);
	const processingImages = useRef(new Set<string>());

	const markImageStatus = useCallback(
		(imageId: string, status: 'processing' | 'complete' | 'error', extraData = {}) => {
			setImages(prev =>
				prev.map(img =>
					img.id === imageId
						? { ...img, status, ...extraData }
						: img
				)
			);
		},
		[setImages]
	);

	const processImage = useCallback(async (image: ImageFile) => {
		if (processingImages.current.has(image.id)) return;

		processingImages.current.add(image.id);
		processingCount.current++;

		markImageStatus(image.id, 'processing');

		try {
			const fileBuffer = await image.file.arrayBuffer();
			if (!fileBuffer.byteLength) throw new Error('Empty file');

			const sourceType = getFileType(image.file);
			const imageData = await decode(sourceType, fileBuffer);
			if (!imageData?.width || !imageData?.height) throw new Error('Invalid image data');

			const compressedBuffer = await encode(outputType, imageData, options);
			if (!compressedBuffer.byteLength) throw new Error('Failed to compress image');

			const blob = new Blob([compressedBuffer], { type: `image/${outputType}` });
			const preview = URL.createObjectURL(blob);

			markImageStatus(image.id, 'complete', {
				preview,
				blob,
				compressedSize: compressedBuffer.byteLength,
				outputType,
			});
		} catch (error) {
			console.error('Error processing image:', error);
			markImageStatus(image.id, 'error', {
				error: error instanceof Error ? error.message : 'Failed to process image',
			});
		} finally {
			processingImages.current.delete(image.id);
			processingCount.current--;
			processNextInQueue();
		}
	}, [options, outputType, markImageStatus]);

	const processNextInQueue = useCallback(() => {
		if (processingCount.current >= MAX_PARALLEL_PROCESSING || queue.length === 0) return;

		setImages(prev => {
			const imagesToProcess = prev.filter(
				img =>
					queue.includes(img.id) &&
					!processingImages.current.has(img.id) &&
					processingCount.current < MAX_PARALLEL_PROCESSING
			);

			imagesToProcess.forEach((image, index) => {
				setTimeout(() => processImage(image), index * 100);
			});

			setQueue(current => current.filter(id => !imagesToProcess.some(img => img.id === id)));

			return prev.map(img =>
				imagesToProcess.some(processImg => processImg.id === img.id)
					? { ...img, status: 'queued' }
					: img
			);
		});
	}, [queue, processImage, setImages]);

	useEffect(() => {
		if (queue.length > 0) processNextInQueue();
	}, [queue, processNextInQueue]);

	const addToQueue = useCallback((imageId: string) => {
		if (!queue.includes(imageId)) {
			setQueue(prev => [...prev, imageId]);
		}
	}, [queue]);

	return { addToQueue };
}
