const c = require('../js/cartridge.js');

test('Loader to be defined', () => {
  const l = new c.Loader('');
  expect(l).not.toBeNull();
  expect(l).not.toBeUndefined();
  expect(c.Loader.loadCart).not.toBeUndefined();
});

test('Loader can load ROM', () => {
  expect.assertions(1);

  const romFilePath = '/Users/pawel/Desktop/roms/SuperMarioBros.nes';

  return c.Loader.loadCart(romFilePath).then(response => {
    expect(response).not.toBeNull();
  });
});

test('Loader fails for non existing files', () => {
  expect.assertions(1);

  return c.Loader.loadCart('doesNotExists.nes').then(reponse => {
    expect(null).not.toBeNull(); //Should not be called
  }, err => {
    expect(err).not.toBeNull(); 
  });
});

test('INESHdeaderParser to be defined', () => {
  const parser = new c.INESHeaderParser('');
  expect(parser).not.toBeNull();
  expect(parser).not.toBeUndefined();
});

test('INESHeaderParser returns error when there is no proper header', () => {
  expect.assertions(1);

  const badHeader = Buffer.from('00000000', 'hex');
  const parser = new c.INESHeaderParser(badHeader);
  return parser.parse(badHeader).then(response => {
    expect(null).not.toBeNull(); //Should not be called
  }, err => {
    expect(err).not.toBeNull();
  });
});

test('INESHeaderParser has proper 4 bytes', () => {
  expect.assertions(2);

  const romFilePath = '/Users/pawel/Desktop/roms/SuperMarioBros.nes';

  return c.Loader.loadCart(romFilePath).then(response => {
    expect(response).not.toBeNull();

    const parser = new c.INESHeaderParser(reponse);
    
    return parser.parse(response).then(response => {
      expect(response).not.toBeNull();
    }, err => {
      expect(null).not.toBeNull(); 
    });
  });
});

test('Cartridge to be defined', () => {
  const cartridge = new c.Cartridge('', '', '', '', '');
  expect(cartridge).not.toBeNull();
  expect(cartridge).not.toBeUndefined();
});
