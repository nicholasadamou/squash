import { MockImageData } from '../MockImageData';

export const encode = jest.fn().mockResolvedValue(new Uint8Array());
export const decode = jest.fn().mockResolvedValue(new MockImageData(1, 1));
