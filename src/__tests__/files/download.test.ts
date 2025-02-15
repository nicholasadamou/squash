import { downloadAllImages, downloadImage } from '../../files/download.ts';

import {ImageFile} from "../../types.ts";

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe('download', () => {
	let createElementSpy: jest.SpyInstance;
	let clickSpy: jest.Mock;

	beforeEach(() => {
		createElementSpy = jest.spyOn(document, 'createElement');
		clickSpy = jest.fn();
		createElementSpy.mockReturnValue({
			click: clickSpy,
			href: '',
			download: '',
		} as Partial<HTMLAnchorElement> as HTMLAnchorElement);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const createImageFile = (status: ImageFile['status'], blob?: Blob): ImageFile => ({
		id: '',
		originalSize: 0,
		blob,
		outputType: 'png',
		file: new File(['test content'], 'image.png', { type: 'image/png' }),
		status,
	});

	describe('downloadImage', () => {
		it('should not create a download link if image blob or outputType is missing', () => {
			const incompleteImage = createImageFile('complete', undefined);

			downloadImage(incompleteImage);
			expect(createElementSpy).not.toHaveBeenCalled();
		});

		it('should create a download link and trigger a download for a valid image', () => {
			const validImage = createImageFile('complete', new Blob(['test content'], { type: 'image/png' }));

			downloadImage(validImage);

			expect(createElementSpy).toHaveBeenCalledWith('a');
			expect(global.URL.createObjectURL).toHaveBeenCalledWith(validImage.blob);
			expect(clickSpy).toHaveBeenCalled();
			expect(global.URL.revokeObjectURL).toHaveBeenCalled();
		});
	});

	describe('downloadAllImages', () => {
		it('should not create a ZIP file if no images are complete', async () => {
			const images = [
				createImageFile('pending'),
				createImageFile('error'),
			];

			await downloadAllImages(images);
			expect(createElementSpy).not.toHaveBeenCalled();
		});

		it('should create a ZIP file with all complete images and trigger a download', async () => {
			const images = [
				createImageFile('complete', new Blob(['test1'], { type: 'image/png' })),
				createImageFile('complete', new Blob(['test2'], { type: 'image/jpeg' })),
			];

			await downloadAllImages(images);

			expect(createElementSpy).toHaveBeenCalledWith('a');
			expect(global.URL.createObjectURL).toHaveBeenCalled();
			expect(clickSpy).toHaveBeenCalled();
			expect(global.URL.revokeObjectURL).toHaveBeenCalled();
		});
	});
});
