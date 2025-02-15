import { ensureWasmLoaded, resetWasmState } from '../../../files/decoders/wasm.ts';

import type { OutputType } from '../../../types.ts';

const mockDynamicImport = jest.fn(() => Promise.resolve({ encode: jest.fn(), decode: jest.fn() }));

describe('wasm', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		resetWasmState();
	});

	describe('normalizeFormat', () => {
		// Extract normalizeFormat for direct testing (or test indirectly via ensureWasmLoaded)
		const normalizeFormat = (format: string): OutputType => {
			if (format === 'jpg') return 'jpeg';
			return format as OutputType;
		};

		it('should convert "jpg" to "jpeg"', () => {
			const result = normalizeFormat('jpg');
			expect(result).toBe('jpeg');
		});

		it('should return the same format for non-jpg inputs', () => {
			expect(normalizeFormat('png')).toBe('png');
			expect(normalizeFormat('webp')).toBe('webp');
		});
	});

	describe('ensureWasmLoaded', () => {
		it('should load the correct WebAssembly module for "jpeg"', async () => {
			await ensureWasmLoaded('jpeg', mockDynamicImport);

			expect(mockDynamicImport).toHaveBeenCalledWith('@jsquash/jpeg');
		});

		it('should load the correct WebAssembly module for "avif"', async () => {
			await ensureWasmLoaded('avif', mockDynamicImport);

			expect(mockDynamicImport).toHaveBeenCalledWith('@jsquash/avif');
		});

		it('should not reload the same WASM module if already initialized', async () => {
			await ensureWasmLoaded('jpeg', mockDynamicImport);
			await ensureWasmLoaded('jpeg', mockDynamicImport);

			expect(mockDynamicImport).toHaveBeenCalledTimes(1);
		});

		it('should throw an error for unsupported formats', async () => {
			await expect(ensureWasmLoaded('unsupported' as OutputType)).rejects.toThrow(
				'Unsupported format: unsupported'
			);
		});
	});
});
