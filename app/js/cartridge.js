
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

class Loader {
  static loadCart(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  //Private

  userHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  romsPath() {
    return getUserHome() + '/Desktop/roms';
  }
}

class Cartridge {
  constructor(prg, chr, mapper, mirror, battery) {
    this.prg = prg;
    this.chr = chr;
    this.mapper = mapper;
    this.mirror = mirror;
    this.battery = battery;
  }
}

class INESHeaderParser {
  constructor(data) {
    this.data = data;
  }

  parse() {
    return new Promise((resolve, reject) => {
      // First 4 bytes should be equal to 'NES\x1a' 
      const iNesHeader = this.data.slice(0, 4);

      if (iNesHeader.equals(Buffer.from('4E45531A', 'hex')) === false) {
        const err = Error('Wrong header format, should have \'NES\x1a\' in front');
        reject(err);
      } 

      const progROM = this.data.readInt8(4);
      const chrROM = this.data.readInt8(5);

      const prgSize = progROM * 16384; // 0x4000 * header bytes
      const chrSize = chrROM * 8192; // 0x2000 * header bytes

      const header6 = this.data.readInt8(6);
      const header7 = this.data.readInt8(7);

      const mirroring = ((this.data.readInt8(6) & 1) !== 0 ? 1 : 0); //TODO - determine mapper
      const battery = (header6 >>> 1) & 1;
      const trainer = (header6 >>> 2) & 1;
      const mapper = (this.data.readInt8(6) >> 4) | (this.data.readInt8(6) & 0xF0); //TODO - determine mirroring

      var padding = 16; // 16 bytes for header
      if (trainer) {
        padding += 512; // 512 padding if trainer is present
      }

      var prg = Buffer.allocUnsafe(prgSize);
      var chr = Buffer.allocUnsafe(chrSize);

      for (let i = 0; i < prgSize; i++) {
        prg[i] = this.data[padding + i];
      }

      for (let i = 0; i < chrSize; i++) {
        chr[i] = this.data[padding + prgSize + i];
      }

      var cartridge = new Cartridge(prg, chr, mapper, mirroring, battery);
      resolve(cartridge);
    });
  }
}

module.exports = {
  Loader: Loader,
  INESHeaderParser: INESHeaderParser,
  Cartridge: Cartridge
};
