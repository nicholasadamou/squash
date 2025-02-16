import type {DynamicImport, OutputType} from '../../types.ts';

const wasmInitialized = new Map<OutputType, boolean>();

/**
 * Reset the WebAssembly state to allow for reinitialization.
 */
export function resetWasmState() {
	wasmInitialized.clear();
}

/**
 * Normalize input to ensure consistent format handling.
 * Converts 'jpg' to 'jpeg' for compatibility.
 * @param format - The input format.
 * @returns Normalized format as OutputType.
 */
function normalizeFormat(format: string): OutputType {
	if (format === 'jpg') return 'jpeg';

	return format as OutputType;
}

/**
 * Map of WebAssembly modules to load dynamically.
 */
const wasmModuleMap: Record<string, () => Promise<unknown>> = {
	'@jsquash/avif': () => import('@jsquash/avif'),
	'@jsquash/jpeg': () => import('@jsquash/jpeg'),
	'@jsquash/jxl': () => import('@jsquash/jxl'),
	'@jsquash/png': () => import('@jsquash/png'),
	'@jsquash/webp': () => import('@jsquash/webp'),
};

/**
 * Cache for dynamically loaded WebAssembly modules.
 */
const moduleCache = new Map<string, Promise<unknown>>();

/**
 * Wrapper around `import()` to dynamically load a WebAssembly module.
 * This is required because we cannot use `import()` directly as a default parameter.
 * @param module - The module specifier to import.
 * @returns A promise that resolves with the module's exports.
 */
async function importModule(module: string): Promise<unknown> {
	if (moduleCache.has(module)) {
		return moduleCache.get(module); // Return cached promise
	}

	const loadModule = wasmModuleMap[module];
	if (!loadModule) {
		throw new Error(`Module "${module}" is not available.`);
	}

	const importPromise = loadModule();

	moduleCache.set(module, importPromise); // Cache the promise

	try {
		return await importPromise;
	} catch (error) {
		moduleCache.delete(module); // Remove from cache if the import fails
		throw new Error(`Failed to load module "${module}". ${error instanceof Error ? error.message : ''}`);
	}
}

/**
 * Ensure the WebAssembly module for the given format is loaded.
 * @param format - The output format (e.g., 'avif', 'jpeg', 'jxl', 'png', 'webp').
 * @param dynamicImport - A function to dynamically import the WebAssembly module. Defaults to `import()`.
 * @param verbose - Whether to log additional information to the console.
 * @throws Will throw an error if the format is unsupported or the WebAssembly module fails to load.
 */
export async function ensureWasmLoaded(
	format: string,
	dynamicImport: DynamicImport = importModule,
	verbose: boolean = false
): Promise<void> {
	const normalizedFormat = normalizeFormat(format);

	if (wasmInitialized.get(normalizedFormat)) {
		if (verbose) console.log(`WASM module for ${normalizedFormat} is already loaded.`);
		return;
	}

	const wasmModules: Record<OutputType, () => Promise<unknown>> = {
		avif: async () => dynamicImport('@jsquash/avif'),
		jpeg: async () => dynamicImport('@jsquash/jpeg'),
		jxl: async () => dynamicImport('@jsquash/jxl'),
		png: async () => dynamicImport('@jsquash/png'),
		webp: async () => dynamicImport('@jsquash/webp'),
	};

	const loadWasm = wasmModules[normalizedFormat];
	if (!loadWasm) {
		throw new Error(`Unsupported format: ${format}`);
	}

	try {
		if (verbose) console.log(`Loading WASM module for ${normalizedFormat}...`);
		await loadWasm();
		wasmInitialized.set(normalizedFormat, true);
		if (verbose) console.log(`WASM module for ${normalizedFormat} loaded successfully.`);
	} catch (error) {
		throw new Error(`Failed to initialize ${format} support. ${error instanceof Error ? error.message : ''}`);
	}
}
