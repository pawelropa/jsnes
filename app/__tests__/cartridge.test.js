const c = require('../js/cartridge.js');

test('Loader to be defined', () => {
  const l = new c.Loader('');
  expect(l).not.toBeNull();
  expect(l).not.toBeUndefined();
});

test('INESHdeaderParser to be defined', () => {
  const parser = new c.INESHeaderParser('');
  expect(parser).not.toBeNull();
  expect(parser).not.toBeUndefined();
});

test('Cartridge to be defined', () => {
  const cartridge = new c.Cartridge('', '', '', '', '');
  expect(cartridge).not.toBeNull();
  expect(cartridge).not.toBeUndefined();
});
