import type { OutputType, CompressionOptions } from '../types';

interface CompressionOptionsProps {
	options: CompressionOptions;
	outputType: OutputType;
	onOptionsChange: (options: CompressionOptions) => void;
	onOutputTypeChange: (type: OutputType) => void;
}

export function CompressionOptions({
									   options,
									   outputType,
									   onOptionsChange,
									   onOutputTypeChange,
								   }: CompressionOptionsProps) {
	return (
		<div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
			<OutputFormatSelector
				selectedFormat={outputType}
				onFormatChange={onOutputTypeChange}
			/>
			{outputType !== 'png' && (
				<QualitySelector
					quality={options.quality}
					onQualityChange={(quality) => onOptionsChange({ quality })}
				/>
			)}
		</div>
	);
}

interface OutputFormatSelectorProps {
	selectedFormat: OutputType;
	onFormatChange: (format: OutputType) => void;
}

export function OutputFormatSelector({
								  selectedFormat,
								  onFormatChange,
							  }: OutputFormatSelectorProps) {
	const formats: OutputType[] = ['avif', 'jpeg', 'jxl', 'png', 'webp'];

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				Output Format
			</label>
			<div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
				{formats.map((format) => (
					<button
						key={format}
						className={`px-4 py-2 rounded-md text-sm font-medium uppercase ${
							selectedFormat === format
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
						onClick={() => onFormatChange(format)}
					>
						{format}
					</button>
				))}
			</div>
		</div>
	);
}

interface QualitySelectorProps {
	quality: number;
	onQualityChange: (quality: number) => void;
}

function QualitySelector({ quality, onQualityChange }: QualitySelectorProps) {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				Quality: {quality}%
			</label>
			<input
				type="range"
				min="1"
				max="100"
				value={quality}
				onChange={(e) => onQualityChange(Number(e.target.value))}
				className="w-full"
			/>
		</div>
	);
}
