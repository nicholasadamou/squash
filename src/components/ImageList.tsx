import React from "react";
import { X, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import { motion } from "framer-motion";

import type { ImageFile } from "../types";

import { formatFileSize } from "../files/file";
import { downloadImage } from "../files/download";

interface ImageListProps {
	images: ImageFile[];
	onRemove: (id: string) => void;
}

export function ImageList({ images, onRemove }: ImageListProps) {
	return (
		<motion.div
			initial={{ y: 200, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className="space-y-4"
		>
			{images.length === 0 ? (
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.3 }}
					className="bg-white rounded-lg shadow-sm p-4 text-center text-gray-500"
				>
					<p>No images added yet.</p>
					<p className="text-sm">Drag and drop images to get started.</p>
				</motion.div>
			) : (
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.3 }}
					className="flex flex-col space-y-4 w-full overflow-y-auto bg-white rounded-lg shadow-sm p-4"
				>
					{images.map((image) => (
						<ImageListItem key={image.id} image={image} onRemove={onRemove} />
					))}
				</motion.div>
			)}
		</motion.div>
	);
}

interface ImageListItemProps {
	image: ImageFile;
	onRemove: (id: string) => void;
}

function ImageListItem({ image, onRemove }: ImageListItemProps) {
	return (
		<motion.div
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ type: "spring", stiffness: 120, damping: 20 }}
			className="bg-gray-50 rounded-lg shadow-sm p-4 flex items-center gap-4 max-w-full"
		>
			{image.preview && (
				<img
					src={image.preview}
					alt={image.file.name}
					className="w-16 h-16 object-cover rounded"
				/>
			)}
			<div className="flex-1 min-w-0">
				<ImageHeader image={image} onRemove={onRemove} />
				<ImageStatus image={image} />
				<ImageSizeInfo image={image} />
			</div>
		</motion.div>
	);
}

function ImageHeader({ image, onRemove }: ImageListItemProps) {
	return (
		<div className="flex items-center justify-between">
			<p className="text-sm font-medium text-gray-900 truncate">
				{image.file.name}
			</p>
			<div className="flex items-center gap-2">
				{image.status === "complete" && (
					<button
						onClick={() => downloadImage(image)}
						className="text-gray-400 hover:text-gray-600"
						title="Download"
					>
						<Download className="w-5 h-5" />
					</button>
				)}
				<button
					onClick={() => onRemove(image.id)}
					className="text-gray-400 hover:text-gray-600"
					title="Remove"
				>
					<X className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
}

function ImageStatus({ image }: { image: ImageFile }) {
	const statusMap: Record<ImageFile["status"], React.ReactNode> = {
		pending: <span>Ready to process</span>,
		queued: <span className="text-blue-600">Queued for processing</span>,
		processing: (
			<span className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Processing...
      </span>
		),
		complete: (
			<span className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        Complete
      </span>
		),
		error: (
			<span className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
				{image.error || "Error processing image"}
      </span>
		),
	};

	return (
		<div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
			{statusMap[image.status] || (
				<span className="text-gray-400">Unknown status</span>
			)}
		</div>
	);
}

function ImageSizeInfo({ image }: { image: ImageFile }) {
	return (
		<div className="mt-1 text-sm text-gray-500">
			{formatFileSize(image.originalSize)}
			{image.compressedSize && (
				<>
					{" → "}
					{formatFileSize(image.compressedSize)}{" "}
					<span className="text-green-600">
            (
						{Math.round(
							((image.originalSize - image.compressedSize) /
								image.originalSize) *
							100
						)}
						% smaller)
          </span>
				</>
			)}
		</div>
	);
}
