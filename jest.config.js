/** @type {import('jest').Config} */
export default {
	transform: {
		'^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'] }]
	},
	extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
	moduleNameMapper: {
		'\\.(wasm)$': '<rootDir>/src/__mocks__/wasmMock.js',
		'\\.(jpg|jpeg|png|gif|webp|avif|jxl)$': '<rootDir>/src/__mocks__/fileMock.js'
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(@jsquash)/)'
	],
	testEnvironment: 'jsdom',
	testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
