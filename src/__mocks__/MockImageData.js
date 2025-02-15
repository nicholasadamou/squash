class MockImageData {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.data = new Uint8ClampedArray(width * height * 4);
	}
}

export { MockImageData };
