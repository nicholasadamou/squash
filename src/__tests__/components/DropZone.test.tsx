import {fireEvent, render, screen} from '@testing-library/react';
import {randomUUID} from 'crypto';

import {DropZone} from '../../components/DropZone';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
	value: {
		randomUUID: () => randomUUID(),
	},
});

// Mock DataTransferItem
class MockDataTransferItem {
	constructor(private file: File, public kind: string = 'file') {
	}

	getAsFile() {
		return this.file;
	}
}

// Mock DataTransferItemList
class MockDataTransferItemList {
	private _items: MockDataTransferItem[] = [];

	get length() {
		return this._items.length;
	}

	add(file: File, kind?: string) {
		this._items.push(new MockDataTransferItem(file, kind));
		return this;
	}

	clear() {
		this._items = [];
	}

	* [Symbol.iterator]() {
		yield* this._items;
	}

	item(index: number) {
		return this._items[index]
	}
}

// Mock DataTransfer
class MockDataTransfer {
	files: File[] = [];
	items: MockDataTransferItemList = new MockDataTransferItemList();
	types: string[] = [];

	constructor() {
	}

	get dataTransfer() {
		return {
			files: this.files,
			items: this.items,
			types: this.types,
			dropEffect: 'none',
			effectAllowed: 'all',
			setData: jest.fn(),
			getData: jest.fn(),
			clearData: jest.fn(),
			setDragImage: jest.fn(),
		};
	}
}

// Mock DataTransfer
Object.defineProperty(window, 'DataTransfer', {value: MockDataTransfer});

describe('DropZone', () => {
	const mockOnFilesDrop = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const createMockFile = (name: string, size: number, type: string): File => {
		return new File([new ArrayBuffer(size)], name, {type});
	};

	test('renders the drop zone with correct text and icon', () => {
		render(<DropZone onFilesDrop={mockOnFilesDrop}/>);

		expect(screen.getByText('Drop images here or click to upload')).toBeInTheDocument();
		expect(screen.getByText('Supports JPEG, PNG, WebP, AVIF, and JXL')).toBeInTheDocument();
		expect(screen.getByLabelText(/drop images here or click to upload/i)).toBeInTheDocument();
	});

	test('handles file input change and calls onFilesDrop with valid files', () => {
		render(<DropZone onFilesDrop={mockOnFilesDrop}/>);

		const input = screen.getByLabelText(/drop images here or click to upload/i) as HTMLInputElement;

		const mockFiles = [createMockFile('image1.png', 1024, 'image/png'), createMockFile('document.txt', 512, 'text/plain'), // This should be filtered out
			createMockFile('image2.jxl', 2048, 'image/jxl'),];

		fireEvent.change(input, {target: {files: mockFiles}});
		input.value = ''; // Manually reset the input value

		expect(mockOnFilesDrop).toHaveBeenCalledTimes(1);
		expect(mockOnFilesDrop).toHaveBeenCalledWith([expect.objectContaining({
			file: mockFiles[0],
			status: 'pending',
			originalSize: 1024
		}), expect.objectContaining({file: mockFiles[2], status: 'pending', originalSize: 2048}),]);
	});

	test('handles drag and drop and calls onFilesDrop with valid files', () => {
		render(<DropZone onFilesDrop={mockOnFilesDrop}/>);
		const dropZone = screen.getByText('Drop images here or click to upload');
		const mockFiles = [createMockFile('image1.jpg', 1024, 'image/jpeg'), createMockFile('image2.jxl', 2048, 'image/jxl'), createMockFile('not-an-image.txt', 512, 'text/plain'), // This should be filtered out
		];

		const dataTransfer = new MockDataTransfer();
		mockFiles.forEach((file) => {
			dataTransfer.items.add(file)
			dataTransfer.files.push(file) // also add to files array since that is checked by handler
		});

		fireEvent.drop(dropZone, {dataTransfer: dataTransfer.dataTransfer}); // provide dataTransfer.dataTransfer as the mock

		// Assertions (check that onFilesDrop is called with the correct files, and no console errors)
		expect(mockOnFilesDrop).toHaveBeenCalledTimes(1);
		expect(mockOnFilesDrop).toHaveBeenCalledWith([expect.objectContaining({
			file: mockFiles[0],
			status: 'pending',
			originalSize: 1024
		}), expect.objectContaining({file: mockFiles[1], status: 'pending', originalSize: 2048}),]);
	});


	test('handles drag over without errors', () => {
		render(<DropZone onFilesDrop={mockOnFilesDrop}/>);

		const dropZone = screen.getByText('Drop images here or click to upload');

		fireEvent.dragOver(dropZone);

		// No errors should be thrown
		expect(mockOnFilesDrop).not.toHaveBeenCalled();
	});

	test('resets the input value after selecting files', () => {
		render(<DropZone onFilesDrop={mockOnFilesDrop}/>);

		const input = screen.getByLabelText(/drop images here or click to upload/i) as HTMLInputElement;

		const mockFile = createMockFile('image1.png', 1024, 'image/png');

		fireEvent.change(input, {target: {files: [mockFile]}});
		input.value = ''; // Manually reset the input value

		expect(mockOnFilesDrop).toHaveBeenCalledTimes(1);
		expect(input.value).toBe('');
	});
});
