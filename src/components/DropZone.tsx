import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

import type { ImageFile } from '../types';

interface DropZoneProps {
	onFilesDrop: (files: ImageFile[]) => void;
}

export function DropZone({ onFilesDrop }: DropZoneProps) {
	const [isDragging, setIsDragging] = useState(false);

	const filterAndMapFiles = (files: FileList | File[]): ImageFile[] => {
		return Array.from(files)
			.filter((file) => file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.jxl'))
			.map((file) => ({
				id: crypto.randomUUID(),
				file,
				status: 'pending' as const,
				originalSize: file.size,
			}));
	};

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const files = filterAndMapFiles(e.dataTransfer.files);
			if (files.length > 0) {
				onFilesDrop(files);
			}
		},
		[onFilesDrop]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback(() => {
		setIsDragging(false);
	}, []);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = filterAndMapFiles(e.target.files || []);
			if (files.length > 0) {
				onFilesDrop(files);
			}
			e.target.value = ''; // Reset input for subsequent uploads
		},
		[onFilesDrop]
	);

	return (
		<motion.div
			className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
				isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
			}`}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			initial={{ y: 200, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ type: 'spring', stiffness: 100, damping: 20 }}
		>
			<input
				type="file"
				id="fileInput"
				className="hidden"
				multiple
				accept="image/*,.jxl"
				onChange={handleFileInput}
			/>
			<label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-4">
				<motion.div
					animate={isDragging ? { scale: 1.2, rotate: 15 } : { scale: 1, rotate: 0 }}
					transition={{ type: 'spring', stiffness: 300 }}
				>
					<Upload className="w-12 h-12 text-gray-400" />
				</motion.div>
				<motion.div
					animate={isDragging ? { y: -5, opacity: 1 } : { y: 0, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<p className="text-lg font-medium text-gray-700">Drop images here or click to upload</p>
					<p className="text-sm text-gray-500">Supports JPEG, PNG, WebP, AVIF, and JXL</p>
				</motion.div>
			</label>
		</motion.div>
	);
}
