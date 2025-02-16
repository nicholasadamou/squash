import { useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CompressionOptions } from './components/CompressionOptions';
import { DropZone } from './components/DropZone';
import { ImageList } from './components/ImageList';
import { DownloadAll } from './components/DownloadAll';

import { useImageQueue } from './hooks/useImageQueue';
import { useImageManager } from './hooks/useImageManager';

import { DEFAULT_QUALITY_SETTINGS } from './files/formatDefaults';
import { downloadAllImages } from './files/download';

import type { ImageFile, OutputType, CompressionOptions as CompressionOptionsType } from './types';

export function App() {
	const [outputType, setOutputType] = useState<OutputType>('webp');
	const [options, setOptions] = useState<CompressionOptionsType>({
		quality: DEFAULT_QUALITY_SETTINGS.webp,
	});

	const { images, setImages, removeImage, clearAllImages, completedImages } = useImageManager();
	const { addToQueue } = useImageQueue(options, outputType, setImages);

	const handleOutputTypeChange = useCallback((type: OutputType) => {
		setOutputType(type);
		if (type !== 'png') {
			setOptions({ quality: DEFAULT_QUALITY_SETTINGS[type] });
		}
	}, []);

	const handleFilesDrop = useCallback(
		(newImages: ImageFile[]) => {
			setImages(newImages);
			requestAnimationFrame(() => {
				newImages.forEach((image) => addToQueue(image.id));
			});
		},
		[addToQueue, setImages]
	);

	const handleDownloadAll = useCallback(async () => {
		await downloadAllImages(images);
	}, [images]);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-12">
				<Header />
				<div className="space-y-4">
					<CompressionOptions
						options={options}
						outputType={outputType}
						onOptionsChange={setOptions}
						onOutputTypeChange={handleOutputTypeChange}
					/>
					<DropZone onFilesDrop={handleFilesDrop} />
					<AnimatePresence>
						{completedImages > 0 && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<DownloadAll onDownloadAll={handleDownloadAll} count={completedImages} />
							</motion.div>
						)}
					</AnimatePresence>
					<AnimatePresence>
						{images.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
							>
								<ClearAllButton onClearAll={clearAllImages} />
							</motion.div>
						)}
					</AnimatePresence>
					<ImageList images={images} onRemove={removeImage} />
				</div>
			</div>
		</div>
	);
}

const Header = () => (
	<motion.div
		initial={{ opacity: 0, y: -50 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		className="text-center mb-8"
	>
		<div className="flex items-center justify-center gap-2 mb-4">
			<h1 className="text-3xl font-bold text-gray-900">🎨 Squash</h1>
		</div>
		<p className="text-gray-600">Compress and convert your images to AVIF, JPEG, JPEG XL, PNG, or WebP</p>
	</motion.div>
);

const ClearAllButton = ({ onClearAll }: { onClearAll: () => void }) => (
	<button
		onClick={onClearAll}
		className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
	>
		<Trash2 className="w-5 h-5" />
		Clear All
	</button>
);
