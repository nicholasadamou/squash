const encode = jest.fn();
const decode = jest.fn();
const init = jest.fn().mockResolvedValue(undefined);

export { encode, decode, init };
