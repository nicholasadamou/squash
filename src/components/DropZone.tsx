import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

import type { ImageFile } from '../types';

interface DropZoneProps {
	onFilesDrop: (files: ImageFile[]) => void;
}

export function DropZone({ onFilesDrop }: DropZoneProps) {
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
			const files = filterAndMapFiles(e.dataTransfer.files);
			if (files.length > 0) {
				onFilesDrop(files);
			}
		},
		[onFilesDrop]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
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
		<div
			className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
			onDrop={handleDrop}
			onDragOver={handleDragOver}
		>
			<input
				type="file"
				id="fileInput"
				className="hidden"
				multiple
				accept="image/*,.jxl"
				onChange={handleFileInput}
			/>
			<label
				htmlFor="fileInput"
				className="cursor-pointer flex flex-col items-center gap-4"
			>
				<Upload className="w-12 h-12 text-gray-400" />
				<div>
					<p className="text-lg font-medium text-gray-700">
						Drop images here or click to upload
					</p>
					<p className="text-sm text-gray-500">
						Supports JPEG, PNG, WebP, AVIF, and JXL
					</p>
				</div>
			</label>
		</div>
	);
}
