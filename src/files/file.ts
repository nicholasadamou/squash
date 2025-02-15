/**
 * Determine the file type of given file based on its extension or MIME type.
 * @param file - The File object to determine the type for.
 * @returns The file type (e.g., jxl, jpg, png).
 */
export function getFileType(file: File): string {
	const extension = file.name.toLowerCase().split('.').pop();
	if (extension === 'jxl') return 'jxl';

	const type = file.type.split('/')[1];
	return type === 'jpeg' ? 'jpg' : type;
}

/**
 * Format a file size in bytes into a human-readable string (e.g., 1.23 MB).
 * @param bytes - The file size in bytes.
 * @returns A formatted string representing the file size.
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 B';

	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
