
function Foo() {

}

class CartridgeLoader {
  constructor(dir) {
    this.dir = dir;
  }
}

class INESHeaderParser {
  constructor(romData) {
    this.romData = romData;
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

