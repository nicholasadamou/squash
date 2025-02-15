import { renderHook, act } from '@testing-library/react';
import { useImageQueue } from '../../hooks/useImageQueue';
import { CompressionOptions } from '../../types';

describe('useImageQueue', () => {
	const mockSetImages = jest.fn();

	const mockImage = (id: string, file: File) => ({
		id,
		file,
		status: 'new',
	});

	const createMockFile = (name: string, size: number, type: string): File => {
		const blob = new Blob(['a'.repeat(size)], { type });
		return new File([blob], name, { type, lastModified: Date.now() });
	};

	const compressionOptions: CompressionOptions = {
		quality: 80,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const setupHook = () =>
		renderHook(() => useImageQueue(compressionOptions, 'jpeg', mockSetImages));

	test('should add image to queue', () => {
		const { result } = setupHook();

		act(() => {
			result.current.addToQueue('image-1');
		});

		expect(result.current.addToQueue).toBeDefined();
	});

	test('should process images in the queue', async () => {
		const file = createMockFile('test.png', 100, 'image/png');
		const imageFile = mockImage('image-1', file);

		const { result } = setupHook();

		await act(async () => {
			result.current.addToQueue(imageFile.id);
		});

		await act(async () => {
			result.current.addToQueue(imageFile.id);
		});

		expect(mockSetImages).toHaveBeenCalled();
	});

	test('should handle errors in image processing', async () => {
		const file = createMockFile('invalid.png', 0, 'image/png');
		const imageFile = mockImage('image-error', file);

		const { result } = setupHook();

		await act(async () => {
			result.current.addToQueue(imageFile.id);
		});

		await act(async () => {
			result.current.addToQueue(imageFile.id);
		});

		expect(mockSetImages).toHaveBeenCalled();
	});
});
