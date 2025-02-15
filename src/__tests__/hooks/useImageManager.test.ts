import { renderHook, act } from '@testing-library/react';

import { useImageManager } from '../../hooks/useImageManager';

type ImageFile = {
	id: string;
	preview: string;
	status: "pending" | "queued" | "processing" | "complete" | "error";
	file: File;
	originalSize: number;
};

describe('useImageManager', () => {
	let mockRevokeObjectURL: jest.Mock;

	beforeEach(() => {
		mockRevokeObjectURL = jest.fn();
		global.URL.revokeObjectURL = mockRevokeObjectURL;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const createMockFile = (name: string, size: number, type: string): File => {
		return new File([new ArrayBuffer(size)], name, { type });
	};

	test('should set images with valid status values', () => {
		const { result } = renderHook(() => useImageManager());

		const newImages: ImageFile[] = [
			{
				id: '1',
				preview: 'blob:http://example.com/1',
				status: 'pending',
				file: createMockFile('image1.png', 1024, 'image/png'),
				originalSize: 1024,
			},
			{
				id: '2',
				preview: 'blob:http://example.com/2',
				status: 'complete',
				file: createMockFile('image2.png', 2048, 'image/png'),
				originalSize: 2048,
			},
		];

		act(() => {
			result.current.setImages(newImages);
		});

		expect(result.current.images).toEqual(newImages);
	});

	test('should remove an image by id and revoke its preview URL', () => {
		const { result } = renderHook(() => useImageManager());

		const images: ImageFile[] = [
			{
				id: '1',
				preview: 'blob:http://example.com/1',
				status: 'pending',
				file: createMockFile('image1.png', 1024, 'image/png'),
				originalSize: 1024,
			},
			{
				id: '2',
				preview: 'blob:http://example.com/2',
				status: 'complete',
				file: createMockFile('image2.png', 2048, 'image/png'),
				originalSize: 2048,
			},
		];

		act(() => {
			result.current.setImages(images);
		});

		act(() => {
			result.current.removeImage('1');
		});

		expect(result.current.images).toEqual([images[1]]);
		expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://example.com/1');
	});

	test('should clear all images and revoke all preview URLs', () => {
		const { result } = renderHook(() => useImageManager());

		const images: ImageFile[] = [
			{
				id: '1',
				preview: 'blob:http://example.com/1',
				status: 'processing',
				file: createMockFile('image1.png', 1024, 'image/png'),
				originalSize: 1024,
			},
			{
				id: '2',
				preview: 'blob:http://example.com/2',
				status: 'error',
				file: createMockFile('image2.png', 2048, 'image/png'),
				originalSize: 2048,
			},
		];

		act(() => {
			result.current.setImages(images);
		});

		act(() => {
			result.current.clearAllImages();
		});

		expect(result.current.images).toEqual([]);
		expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
		expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://example.com/1');
		expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://example.com/2');
	});

	test('should return the correct count of completed images', () => {
		const { result } = renderHook(() => useImageManager());

		const images: ImageFile[] = [
			{
				id: '1',
				preview: 'blob:http://example.com/1',
				status: 'pending',
				file: createMockFile('image1.png', 1024, 'image/png'),
				originalSize: 1024,
			},
			{
				id: '2',
				preview: 'blob:http://example.com/2',
				status: 'complete',
				file: createMockFile('image2.png', 2048, 'image/png'),
				originalSize: 2048,
			},
			{
				id: '3',
				preview: 'blob:http://example.com/3',
				status: 'complete',
				file: createMockFile('image3.png', 4096, 'image/png'),
				originalSize: 4096,
			},
		];

		act(() => {
			result.current.setImages(images);
		});

		expect(result.current.completedImages).toBe(2);
	});
});
