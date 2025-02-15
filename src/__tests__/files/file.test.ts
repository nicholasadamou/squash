import { getFileType, formatFileSize } from '../../files/file.ts';

describe('getFileType', () => {
	it('should return "jxl" for .jxl files', () => {
		const file = new File([''], 'image.jxl', { type: 'image/jxl' });
		expect(getFileType(file)).toBe('jxl');
	});

	it('should return "jpg" for .jpeg files', () => {
		const file = new File([''], 'image.jpeg', { type: 'image/jpeg' });
		expect(getFileType(file)).toBe('jpg');
	});

	it('should return the extension from the MIME type', () => {
		const file = new File([''], 'image.png', { type: 'image/png' });
		expect(getFileType(file)).toBe('png');
	});
});

describe('formatFileSize', () => {
	it('should format bytes to human-readable strings', () => {
		expect(formatFileSize(0)).toBe('0 B');
		expect(formatFileSize(1023)).toBe('1023.00 B');
		expect(formatFileSize(1024)).toBe('1.00 KB');
		expect(formatFileSize(1048576)).toBe('1.00 MB');
		expect(formatFileSize(1073741824)).toBe('1.00 GB');
	});
});
