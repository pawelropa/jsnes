const fs = require('fs');

(function CPU() {
	var acc = 0x00, // Accumulator
		x = 0x00, // X register
		y = 0x00, // Y register
		sp = 0x00, // Stack pointer

		// Flags
		fc = 0, // Carry
		fz = 0, // Zero
		fi = 0, // Interrupt
		fd = 0, // Decimal
		fb = 0, // Break,
		fu = 0, // Unused bit, presumably it is set sometimes
		fo = 0, // Overflow
		fn = 0, // Negative sign

		pc = 0x0000, // Program counter - 16 bit
		memory = Uint8Array(65535); // 0xFFFF,
		tmp; // helper var

	var mem_read = function(addr) {
		if (addr < 0x800) {
			return memory[addr];
		} else {
			return mem_read_other(addr);
		}
	};

	var mem_read_other = function(addr) {
		if (addr < 0x2000) {
			return ram[addr & 0x7FF];
		} else if (addr <= 0x3FFF) {
			return ppu_read(addr);
		} else if (addr >= 0x4000 && addr <= 0x4017) {
			return apu_read(addr);
		} else {
			return memory[addr];
			//return mem_read_fp[addr >> 12](addr);
		}
	};
	
	// IMPLIED mode
	// IMIDIATE mode
	// ZERO PAGE READ mode
	// ZERO PAGE INDEX ADDRESSING mode 

	// Read modes types
	var a_imp() = function() {};
	var a_imm() = function() {};
	var a_zp_r() = function() {};
	var a_zpx_r() = function() {};
	var a_zpy_r() = function() {};
	var a_abs_r() = function() {};
	var a_absx_r() = function() {};
	var a_absy_r() = function() {};
	var a_indx_r() = function() {};
	var a_indy_r() = function() {};

	// Write modes types
	var w_zp_w() = function() {};
	var w_zpx_w() = function() {};
	var w_zpy_w() = function() {};
	var w_abs_w() = function() {};
	var w_absx_w() = function() {};
	var w_absy_w() = function() {};
	var w_indx_w() = function() {};
	var w_indy_w() = function() {};

	// Read modify write mode
	var zp_rmw() = function() {};
	var zpx_rmw() = function() {};
	var abs_rmw() = function() {};
	var absx_rmw() = function() {};
	var absy_rmw() = function() {};
	var indx_rmw() = function() {};
	var indy_rmw() = function() {};
	var rmw_w() = function() {};

	var ppu_read = function(addr) {};
	var apu_read = function(addr) {};

	var adc = function (mem) {
		tmp = this.acc + mem + this.fc;
		this.fo = (tmp ^ this.acc) & (tmp ^ mem) & 0x80;
		this.fc = (tmp & 0x100) > 8;
		this.fz = this.fn = this.acc = tmp & 0xFF;
		this.fz = !this.fz;
	};

	var ahx = function () {};
	var alr = function () {};
	var anc = function () {};
	var and = function () {};
	var arr = function () {};
	var asl = function () {};
	var axs = function () {};
	var bcc = function () {};
	var bcs = function () {};
	var beq = function () {};
	var bit = function () {};
	var bmi = function () {};
	var bne = function () {};
	var bpl = function () {};
	var brk = function () {};
	var bvc = function () {};
	var bvs = function () {};
	var clc = function () {};
	var cld = function () {};
	var cli = function () {};
	var clv = function () {};
	var cmp = function () {};
	var cpx = function () {};
	var cpy = function () {};
	var dcp = function () {};
	var dec = function () {};
	var dex = function () {};
	var dey = function () {};
	var eor = function () {};
	var inc = function () {};
	var inx = function () {};
	var iny = function () {};
	var isc = function () {};
	var jmp = function () {};
	var jsr = function () {};
	var kil = function () {};
	var las = function () {};
	var lax = function () {};
	var lda = function () {};
	var ldx = function () {};
	var ldy = function () {};
	var lsr = function () {};
	var nop = function () {};
	var ora = function () {};
	var pha = function () {};
	var php = function () {};
	var pla = function () {};
	var plp = function () {};
	var rla = function () {};
	var rol = function () {};
	var ror = function () {};
	var rra = function () {};
	var rti = function () {};
	var rts = function () {};
	var sax = function () {};
	var sbc = function () {};
	var sec = function () {};
	var sed = function () {};
	var sei = function () {};
	var shx = function () {};
	var shy = function () {};
	var slo = function () {};
	var sre = function () {};
	var sta = function () {};
	var stx = function () {};
	var sty = function () {};
	var tas = function () {};
	var tax = function () {};
	var tay = function () {};
	var tsx = function () {};
	var txa = function () {};
	var txs = function () {};
	var tya = function () {};
	var xaa = function () {};

	var opcodes = [
		brk, ora, kil, slo, nop, ora, asl, slo, php, ora, asl, anc, nop, ora, asl, slo,
		bpl, ora, kil, slo, nop, ora, asl, slo, clc, ora, nop, slo, nop, ora, asl, slo,
		jsr, and, kil, rla, bit, and, rol, rla, plp, and, rol, anc, bit, and, rol, rla,
		bmi, and, kil, rla, nop, and, rol, rla, sec, and, nop, rla, nop, and, rol, rla,
		rti, eor, kil, sre, nop, eor, lsr, sre, pha, eor, lsr, alr, jmp, eor, lsr, sre,
		bvc, eor, kil, sre, nop, eor, lsr, sre, cli, eor, nop, sre, nop, eor, lsr, sre,
		rts, adc, kil, rra, nop, adc, ror, rra, pla, adc, ror, arr, jmp, adc, ror, rra,
		bvs, adc, kil, rra, nop, adc, ror, rra, sei, adc, nop, rra, nop, adc, ror, rra,
		nop, sta, nop, sax, sty, sta, stx, sax, dey, nop, txa, xaa, sty, sta, stx, sax,
		bcc, sta, kil, ahx, sty, sta, stx, sax, tya, sta, txs, tas, shy, sta, shx, ahx,
		ldy, lda, ldx, lax, ldy, lda, ldx, lax, tay, lda, tax, lax, ldy, lda, ldx, lax,
		bcs, lda, kil, lax, ldy, lda, ldx, lax, clv, lda, tsx, las, ldy, lda, ldx, lax,
		cpy, cmp, nop, dcp, cpy, cmp, dec, dcp, iny, cmp, dex, axs, cpy, cmp, dec, dcp,
		bne, cmp, kil, dcp, nop, cmp, dec, dcp, cld, cmp, nop, dcp, nop, cmp, dec, dcp,
		cpx, sbc, nop, isc, cpx, sbc, inc, isc, inx, sbc, nop, sbc, cpx, sbc, inc, isc,
		beq, sbc, kil, isc, nop, sbc, inc, isc, sed, sbc, nop, isc, nop, sbc, inc, isc
	];

	var insCycle = [
		7, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 4, 4, 6, 6,
		2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
		6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 4, 4, 6, 6,
		2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
		6, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 3, 4, 6, 6,
		2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
		6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 5, 4, 6, 6,
		2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
		2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4,
		2, 6, 2, 6, 4, 4, 4, 4, 2, 5, 2, 5, 5, 5, 5, 5,
		2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4,
		2, 5, 2, 5, 4, 4, 4, 4, 2, 4, 2, 4, 4, 4, 4, 4,
		2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6,
		2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
		2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6,
		2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
	];

	var insMode = [
		6, 7, 6, 7, 11, 11, 11, 11, 6, 5, 4, 5, 1, 1, 1, 1,
		10, 9, 6, 9, 12, 12, 12, 12, 6, 3, 6, 3, 2, 2, 2, 2,
		1, 7, 6, 7, 11, 11, 11, 11, 6, 5, 4, 5, 1, 1, 1, 1,
		10, 9, 6, 9, 12, 12, 12, 12, 6, 3, 6, 3, 2, 2, 2, 2,
		6, 7, 6, 7, 11, 11, 11, 11, 6, 5, 4, 5, 1, 1, 1, 1,
		10, 9, 6, 9, 12, 12, 12, 12, 6, 3, 6, 3, 2, 2, 2, 2,
		6, 7, 6, 7, 11, 11, 11, 11, 6, 5, 4, 5, 8, 1, 1, 1,
		10, 9, 6, 9, 12, 12, 12, 12, 6, 3, 6, 3, 2, 2, 2, 2,
		5, 7, 5, 7, 11, 11, 11, 11, 6, 5, 6, 5, 1, 1, 1, 1,
		10, 9, 6, 9, 12, 12, 13, 13, 6, 3, 6, 3, 2, 2, 3, 3,
		5, 7, 5, 7, 11, 11, 11, 11, 6, 5, 6, 5, 1, 1, 1, 1,
		10, 9, 6, 9, 12, 12, 13, 13, 6, 3, 6, 3, 2, 2, 3, 3,
		5, 7, 5, 7, 11, 11, 11, 11, 6, 5, 6, 5, 1, 1, 1, 1,
		10, 9, 6, 9, 12, 12, 12, 12, 6, 3, 6, 3, 2, 2, 2, 2,
		5, 7, 5, 7, 11, 11, 11, 11, 6, 5, 6, 5, 1, 1, 1, 1,
		10, 9, 6, 9, 12, 12, 12, 12, 6, 3, 6, 3, 2, 2, 2, 2,
	];

	var insSize = [
		1, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 3, 3, 3, 0,
		3, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 3, 3, 3, 0,
		1, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 3, 3, 3, 0,
		1, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 0, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 0, 3, 0, 0,
		2, 2, 2, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0,
		2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 3, 3, 3, 0,
	];

	var insPageCycle = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
	];
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
