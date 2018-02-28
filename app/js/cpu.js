const fs = require('fs');

// (function CPU() {
//   var acc,
//       x, 
//       y,
//       sp,
//       sf = 0x00,
//       PC = 0x0000;
//     var carry = function() {
//     };
// })();

class CPU {
  constructor(acc, x, y, sp, sf, pc) {
    this.acc = acc;
    this.x = x;
    this.y = y;
    this.sp = sp;
    this.sf = sf;
    this.pc = pc;
  }

  
  /*
    var acc,
        x,
        y,
        sp,
        sf,
        PC = 0x0000;
        */
}

module.exports = {
  CPU: CPU
};
