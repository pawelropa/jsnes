const c = require('../js/cartridge.js');

const a = new c.CartridgeLoader(''); 

test('CartridgeLoader to be defined', () => {
  expect(a).not.toBeNull();
  expect(a).not.toBeUndefined();
});

