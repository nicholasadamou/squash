class MockImageData {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.data = new Uint8ClampedArray(width * height * 4);
	}
}

export const encode = jest.fn().mockResolvedValue(new Uint8Array());
export const decode = jest.fn().mockResolvedValue(new MockImageData(1, 1));
