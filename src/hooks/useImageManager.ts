import { useState, useCallback, useMemo } from 'react';

import type { ImageFile } from '../types';

export function useImageManager() {
	const [images, setImages] = useState<ImageFile[]>([]);

	const removeImage = useCallback((id: string) => {
		setImages((prev) => {
			const imageToRemove = prev.find((img) => img.id === id);
			if (imageToRemove?.preview) {
				URL.revokeObjectURL(imageToRemove.preview);
			}
			return prev.filter((img) => img.id !== id);
		});
	}, []);

	const clearAllImages = useCallback(() => {
		setImages((prev) => {
			prev.forEach((image) => {
				if (image.preview) {
					URL.revokeObjectURL(image.preview);
				}
			});
			return [];
		});
	}, []);

	const completedImages = useMemo(() => {
		return images.filter((img) => img.status === 'complete').length;
	}, [images]);

	return {
		images,
		setImages,
		removeImage,
		clearAllImages,
		completedImages,
	};
}
