const fs = require('fs');

(function CPU() {
  var acc = 0x00, // Accumulator
      x = 0x00, // X register
      y = 0x00, // Y register
      sp = 0x00, // Stack pointer

      // Flags
      carry = 0,
      zero = 0,
      interrupt = 0,
      decimalMode = 0,
      brk = 0, //Break,
      unused = 0,
      overflow = 0,
      sign = 0,

      pc =  0x0000; // Program counter - 16 bit
      memory = Uint8Array(65535) // 0xFFFF 
})();

class CPU {
  // constructor(acc, x, y, sp, sf, pc, c, z, i, d, b, u, o, s) {
  //   this.acc = acc;
  //   this.x = x;
  //   this.y = y;
  //   this.sp = sp;
  //   this.sf = sf;
  //   this.pc = pc;
  //   this.c = c; //Carry flag
  //   this.z = z; //Zero flag
  //   this.i = i; //Interrupt flag
  //   this.d = d; //Decimal flag
  //   this.b = b; //Break flag
  //   this.u = u; //Unused flag
  //   this.o = o; //Overflow flag
  //   this.s = s; //Sign flag
  // }

  getBit(value, position) {
    return (value >> position) & 1;
  }

  setBit(value, position) {
    return value | (1 << position)
  }

  clearBit(value, position) {
    return value & ~(1 << position)
  }
}

module.exports = {
  CPU: CPU
};
