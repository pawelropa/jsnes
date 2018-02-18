const c = require('../js/cartridge.js');

test('Loader to be defined', () => {
  const l = new c.Loader('');
  expect(l).not.toBeNull();
  expect(l).not.toBeUndefined();
});

test('Loader can load ROM', () => {
  expect(c.Loader.loadCart).not.toBeUndefined();
  const romFilePath = '~/Desktop/roms/SuperMarioBros.nes';
  //expect(c.Loader.loadCart(romFilePath)).to.beNull;
  c.Loader.loadCart(romFilePath).then(response => {
    console.log('Got response' + response); 
  }, error => {
    console.log('Got error' + error); 
  });
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
