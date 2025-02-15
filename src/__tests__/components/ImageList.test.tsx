import { render, screen, fireEvent } from '@testing-library/react';

import { ImageList } from '../../components/ImageList';

import { downloadImage } from '../../files/download';
import { formatFileSize } from '../../files/file';

import type { ImageFile } from '../../types';

jest.mock('../../files/download', () => ({
	downloadImage: jest.fn(),
}));

jest.mock('../../files/file', () => ({
	formatFileSize: jest.fn((size: number) => `${size} bytes`),
}));

describe('ImageList', () => {
	const mockOnRemove = jest.fn();

	const createMockImage = (
		id: string,
		name: string,
		size: number,
		status: ImageFile['status'],
		preview: string = ''
	): ImageFile => ({
		id,
		file: new File([], name),
		originalSize: size,
		compressedSize: undefined,
		status,
		preview,
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('renders nothing if the images array is empty', () => {
		render(<ImageList images={[]} onRemove={mockOnRemove} />);

		expect(screen.queryByRole('list')).not.toBeInTheDocument();
	});

	test('renders a list of images with their names and statuses', () => {
		const images = [
			createMockImage('1', 'image1.png', 1024, 'pending'),
			createMockImage('2', 'image2.jpg', 2048, 'complete'),
		];

		render(<ImageList images={images} onRemove={mockOnRemove} />);

		expect(screen.getByText('image1.png')).toBeInTheDocument();
		expect(screen.getByText('Ready to process')).toBeInTheDocument();
		expect(screen.getByText('image2.jpg')).toBeInTheDocument();
		expect(screen.getByText('Complete')).toBeInTheDocument();
	});

	test('calls onRemove when the remove button is clicked', () => {
		const images = [createMockImage('1', 'image1.png', 1024, 'pending')];

		render(<ImageList images={images} onRemove={mockOnRemove} />);

		const removeButton = screen.getByTitle('Remove');
		fireEvent.click(removeButton);

		expect(mockOnRemove).toHaveBeenCalledTimes(1);
		expect(mockOnRemove).toHaveBeenCalledWith('1');
	});

	test('calls downloadImage when the download button is clicked for complete status', () => {
		const images = [createMockImage('1', 'image1.png', 1024, 'complete')];

		render(<ImageList images={images} onRemove={mockOnRemove} />);

		const downloadButton = screen.getByTitle('Download');
		fireEvent.click(downloadButton);

		expect(downloadImage).toHaveBeenCalledTimes(1);
		expect(downloadImage).toHaveBeenCalledWith(images[0]);
	});

	test('displays formatted file size using formatFileSize', () => {
		const images = [createMockImage('1', 'image1.png', 1024, 'pending')];

		render(<ImageList images={images} onRemove={mockOnRemove} />);

		expect(formatFileSize).toHaveBeenCalledWith(1024);
		expect(screen.getByText('1024 bytes')).toBeInTheDocument();
	});

	test('displays compressed size information if available', () => {
		const images = [
			{
				...createMockImage('1', 'image1.png', 1024, 'complete'),
				compressedSize: 512,
			},
		];

		render(<ImageList images={images} onRemove={mockOnRemove} />);

		// Use regex or function matchers for more flexible text matching
		expect(screen.getByText(/1024 bytes/)).toBeInTheDocument();
		expect(screen.getByText(/512 bytes/)).toBeInTheDocument();
		expect(screen.getByText(/50/)).toBeInTheDocument();
		expect(screen.getByText(/% smaller/)).toBeInTheDocument();
	});
});
