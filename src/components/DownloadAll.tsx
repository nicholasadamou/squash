import { Download } from 'lucide-react';

interface DownloadAllProps {
	onDownloadAll: () => void;
	count: number;
}

export function DownloadAll({ onDownloadAll, count }: DownloadAllProps) {
	const buttonLabel = `Download All (${count} ${count === 1 ? 'image' : 'images'})`;

	return (
		<button
			onClick={onDownloadAll}
			className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
			aria-label={buttonLabel}
		>
			<Download className="w-5 h-5" />
			<span>{buttonLabel}</span>
		</button>
	);
}
