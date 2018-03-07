const fs = require('fs');

class Opcode {
	constructor(opcodeFunction, addrMode, instructionSize, cycles, pageCycle) {
		this.opcodeFunction = opcodeFunction;
		this.addrMode = addrMode;
		this.instructionSize = instructionSize;
		this.cycles = cycles;
		this.pageCycle = pageCycle;
	}
};

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
		memory = new Uint8Array(65535), // 0xFFFF,
		tmp; // helper var

	const Mode = {
		ACC: 0,
		IMMEDIATE: 1,
		ZERO_PAGE: 2,
		ZERO_PAGE_X: 3,
		ZERO_PAGE_Y: 4,
		ABSOLUTE: 5,
		ABSOLUTE_X: 6,
		ABSOLUTE_Y: 7,
		IMPLIED: 8,
		RELATIVE: 9,
		INDIRECT_X: 10,
		INDIRECT_Y: 11,
		ABSOLUTE_INDIRECT: 12,
	};

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

	var setZero = function(value) {
		this.fz = value == 0 ? 1 : 0;
	};

	var setNegative = function(value) {
		this.fn = value & 0x80 != 0 ? 1 : 0;	
	}

	var setCarry = function(value) {
		this.fc = value > 0xff;
	}
	
	var adc = function (mem) {
		// unsigned int temp = src + AC + (IF_CARRY() ? 1 : 0);
		// SET_ZERO(temp & 0xff);	/* This is not valid in decimal mode */
		// SET_SIGN(temp);
		// SET_OVERFLOW(!((AC ^ src) & 0x80) && ((AC ^ temp) & 0x80));
		// SET_CARRY(temp > 0xff
		// AC = ((BYTE) temp);

		var tmp = this.acc + mem + this.fc;
		setZero(tmp);
		setNegative(tmp);
		setCarry(tmp);
		// this.fz = tmp == 0 ? 1 : 0;
		// this.fn = tmp & 0x80 != 0 ? 1 : 0;
		// this.fc = tmp > 0xff;
		this.fo = !(((this.acc ^ mem) & 0x80) && ((this.acc ^ tmp) & 0x80));

		this.acc = tmp;

		// this.fo = (tmp ^ this.acc) & (tmp ^ mem) & 0x80;
		// this.fc = (tmp & 0x100) > 8;
		// this.fz = this.fn = this.acc = tmp & 0xFF;
		// this.fz = !this.fz;
	};

	var ahx = function () {};
	var alr = function () {};
	var anc = function () {};

	var and = function (mem) {
		mem = this.acc & mem;
		setZero(mem);
		setNegative(mem);
		// this.fz = mem == 0 ? 1 : 0;
		// this.fn = tmp & 0x80 != 0 ? 1 : 0;
		this.acc = mem	
	};

	var arr = function () {};
	var asl = function (mem, mode) {
		setCarry(mem & 0x80);
		mem <<= 1;
		mem &= 0xFF;
		setNegative(mem);
		setZero(mem);
		
		if (mode == Mode.ACC) {
			this.acc = mem
		} else {
// ????
		}
	};
	var axs = function () {};
	var bcc = function () {
		if (this.fc == 0) {

		}	
	};
	var bcs = function () {};
	var beq = function () {};
	var bit = function () {};
	var bmi = function () {};
	var bne = function () {};
	var bpl = function () {};
	var brk = function () {};
	var bvc = function () {};
	var bvs = function () {};

	var clc = function () {
		this.fc = 0;
	};
	var cld = function () {
		this.fd = 0;
	};

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
		new Opcode(brk, Mode.IMPLIED, 1, 7, 0),
		new Opcode(ora, Mode.INDIRECT_X, 2, 6, 0),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(slo, Mode.INDIRECT_X, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(ora, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(asl, Mode.ZERO_PAGE, 2, 5, 0),
		new Opcode(slo, Mode.ZERO_PAGE, 0, 5, 0),
		new Opcode(php, Mode.IMPLIED, 1, 3, 0),
		new Opcode(ora, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(asl, Mode.ACC, 1, 2, 0),
		new Opcode(anc, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(nop, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(ora, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(asl, Mode.ABSOLUTE, 3, 6, 0),
		new Opcode(slo, Mode.ABSOLUTE, 0, 6, 0),
		new Opcode(bpl, Mode.RELATIVE, 2, 2, 1),
		new Opcode(ora, Mode.INDIRECT_Y, 2, 5, 1),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(slo, Mode.INDIRECT_Y, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(ora, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(asl, Mode.ZERO_PAGE_X, 2, 6, 0),
		new Opcode(slo, Mode.ZERO_PAGE_X, 0, 6, 0),
		new Opcode(clc, Mode.IMPLIED, 1, 2, 0),
		new Opcode(ora, Mode.ABSOLUTE_Y, 3, 4, 1),
		new Opcode(nop, Mode.IMPLIED, 1, 2, 0),
		new Opcode(slo, Mode.ABSOLUTE_Y, 0, 7, 0),
		new Opcode(nop, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(ora, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(asl, Mode.ABSOLUTE_X, 3, 7, 0),
		new Opcode(slo, Mode.ABSOLUTE_X, 0, 7, 0),
		new Opcode(jsr, Mode.ABSOLUTE, 3, 6, 0),
		new Opcode(and, Mode.INDIRECT_X, 2, 6, 0),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(rla, Mode.INDIRECT_X, 0, 8, 0),
		new Opcode(bit, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(and, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(rol, Mode.ZERO_PAGE, 2, 5, 0),
		new Opcode(rla, Mode.ZERO_PAGE, 0, 5, 0),
		new Opcode(plp, Mode.IMPLIED, 1, 4, 0),
		new Opcode(and, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(rol, Mode.ACC, 1, 2, 0),
		new Opcode(anc, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(bit, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(and, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(rol, Mode.ABSOLUTE, 3, 6, 0),
		new Opcode(rla, Mode.ABSOLUTE, 0, 6, 0),
		new Opcode(bmi, Mode.RELATIVE, 2, 2, 1),
		new Opcode(and, Mode.INDIRECT_Y, 2, 5, 1),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(rla, Mode.INDIRECT_Y, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(and, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(rol, Mode.ZERO_PAGE_X, 2, 6, 0),
		new Opcode(rla, Mode.ZERO_PAGE_X, 0, 6, 0),
		new Opcode(sec, Mode.IMPLIED, 1, 2, 0),
		new Opcode(and, Mode.ABSOLUTE_Y, 3, 4, 1),
		new Opcode(nop, Mode.IMPLIED, 1, 2, 0),
		new Opcode(rla, Mode.ABSOLUTE_Y, 0, 7, 0),
		new Opcode(nop, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(and, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(rol, Mode.ABSOLUTE_X, 3, 7, 0),
		new Opcode(rla, Mode.ABSOLUTE_X, 0, 7, 0),
		new Opcode(rti, Mode.IMPLIED, 1, 6, 0),
		new Opcode(eor, Mode.INDIRECT_X, 2, 6, 0),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(sre, Mode.INDIRECT_X, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(eor, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(lsr, Mode.ZERO_PAGE, 2, 5, 0),
		new Opcode(sre, Mode.ZERO_PAGE, 0, 5, 0),
		new Opcode(pha, Mode.IMPLIED, 1, 3, 0),
		new Opcode(eor, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(lsr, Mode.ACC, 1, 2, 0),
		new Opcode(alr, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(jmp, Mode.ABSOLUTE, 3, 3, 0),
		new Opcode(eor, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(lsr, Mode.ABSOLUTE, 3, 6, 0),
		new Opcode(sre, Mode.ABSOLUTE, 0, 6, 0),
		new Opcode(bvc, Mode.RELATIVE, 2, 2, 1),
		new Opcode(eor, Mode.INDIRECT_Y, 2, 5, 1),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(sre, Mode.INDIRECT_Y, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(eor, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(lsr, Mode.ZERO_PAGE_X, 2, 6, 0),
		new Opcode(sre, Mode.ZERO_PAGE_X, 0, 6, 0),
		new Opcode(cli, Mode.IMPLIED, 1, 2, 0),
		new Opcode(eor, Mode.ABSOLUTE_Y, 3, 4, 1),
		new Opcode(nop, Mode.IMPLIED, 1, 2, 0),
		new Opcode(sre, Mode.ABSOLUTE_Y, 0, 7, 0),
		new Opcode(nop, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(eor, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(lsr, Mode.ABSOLUTE_X, 3, 7, 0),
		new Opcode(sre, Mode.ABSOLUTE_X, 0, 7, 0),
		new Opcode(rts, Mode.IMPLIED, 1, 6, 0),
		new Opcode(adc, Mode.INDIRECT_X, 2, 6, 0),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(rra, Mode.INDIRECT_X, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(adc, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(ror, Mode.ZERO_PAGE, 2, 5, 0),
		new Opcode(rra, Mode.ZERO_PAGE, 0, 5, 0),
		new Opcode(pla, Mode.IMPLIED, 1, 4, 0),
		new Opcode(adc, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(ror, Mode.ACC, 1, 2, 0),
		new Opcode(arr, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(jmp, Mode.ABSOLUTE_INDIRECT, 3, 5, 0),
		new Opcode(adc, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(ror, Mode.ABSOLUTE, 3, 6, 0),
		new Opcode(rra, Mode.ABSOLUTE, 0, 6, 0),
		new Opcode(bvs, Mode.RELATIVE, 2, 2, 1),
		new Opcode(adc, Mode.INDIRECT_Y, 2, 5, 1),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(rra, Mode.INDIRECT_Y, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(adc, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(ror, Mode.ZERO_PAGE_X, 2, 6, 0),
		new Opcode(rra, Mode.ZERO_PAGE_X, 0, 6, 0),
		new Opcode(sei, Mode.IMPLIED, 1, 2, 0),
		new Opcode(adc, Mode.ABSOLUTE_Y, 3, 4, 1),
		new Opcode(nop, Mode.IMPLIED, 1, 2, 0),
		new Opcode(rra, Mode.ABSOLUTE_Y, 0, 7, 0),
		new Opcode(nop, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(adc, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(ror, Mode.ABSOLUTE_X, 3, 7, 0),
		new Opcode(rra, Mode.ABSOLUTE_X, 0, 7, 0),
		new Opcode(nop, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(sta, Mode.INDIRECT_X, 2, 6, 0),
		new Opcode(nop, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(sax, Mode.INDIRECT_X, 0, 6, 0),
		new Opcode(sty, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(sta, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(stx, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(sax, Mode.ZERO_PAGE, 0, 3, 0),
		new Opcode(dey, Mode.IMPLIED, 1, 2, 0),
		new Opcode(nop, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(txa, Mode.IMPLIED, 1, 2, 0),
		new Opcode(xaa, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(sty, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(sta, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(stx, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(sax, Mode.ABSOLUTE, 0, 4, 0),
		new Opcode(bcc, Mode.RELATIVE, 2, 2, 1),
		new Opcode(sta, Mode.INDIRECT_Y, 2, 6, 0),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(ahx, Mode.INDIRECT_Y, 0, 6, 0),
		new Opcode(sty, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(sta, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(stx, Mode.ZERO_PAGE_Y, 2, 4, 0),
		new Opcode(sax, Mode.ZERO_PAGE_Y, 0, 4, 0),
		new Opcode(tya, Mode.IMPLIED, 1, 2, 0),
		new Opcode(sta, Mode.ABSOLUTE_Y, 3, 5, 0),
		new Opcode(txs, Mode.IMPLIED, 1, 2, 0),
		new Opcode(tas, Mode.ABSOLUTE_Y, 0, 5, 0),
		new Opcode(shy, Mode.ABSOLUTE_X, 0, 5, 0),
		new Opcode(sta, Mode.ABSOLUTE_X, 3, 5, 0),
		new Opcode(shx, Mode.ABSOLUTE_Y, 0, 5, 0),
		new Opcode(ahx, Mode.ABSOLUTE_Y, 0, 5, 0),
		new Opcode(ldy, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(lda, Mode.INDIRECT_X, 2, 6, 0),
		new Opcode(ldx, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(lax, Mode.INDIRECT_X, 0, 6, 0),
		new Opcode(ldy, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(lda, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(ldx, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(lax, Mode.ZERO_PAGE, 0, 3, 0),
		new Opcode(tay, Mode.IMPLIED, 1, 2, 0),
		new Opcode(lda, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(tax, Mode.IMPLIED, 1, 2, 0),
		new Opcode(lax, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(ldy, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(lda, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(ldx, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(lax, Mode.ABSOLUTE, 0, 4, 0),
		new Opcode(bcs, Mode.RELATIVE, 2, 2, 1),
		new Opcode(lda, Mode.INDIRECT_Y, 2, 5, 1),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(lax, Mode.INDIRECT_Y, 0, 5, 1),
		new Opcode(ldy, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(lda, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(ldx, Mode.ZERO_PAGE_Y, 2, 4, 0),
		new Opcode(lax, Mode.ZERO_PAGE_Y, 0, 4, 0),
		new Opcode(clv, Mode.IMPLIED, 1, 2, 0),
		new Opcode(lda, Mode.ABSOLUTE_Y, 3, 4, 1),
		new Opcode(tsx, Mode.IMPLIED, 1, 2, 0),
		new Opcode(las, Mode.ABSOLUTE_Y, 0, 4, 1),
		new Opcode(ldy, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(lda, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(ldx, Mode.ABSOLUTE_Y, 3, 4, 1),
		new Opcode(lax, Mode.ABSOLUTE_Y, 0, 4, 1),
		new Opcode(cpy, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(cmp, Mode.INDIRECT_X, 2, 6, 0),
		new Opcode(nop, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(dcp, Mode.INDIRECT_X, 0, 8, 0),
		new Opcode(cpy, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(cmp, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(dec, Mode.ZERO_PAGE, 2, 5, 0),
		new Opcode(dcp, Mode.ZERO_PAGE, 0, 5, 0),
		new Opcode(iny, Mode.IMPLIED, 1, 2, 0),
		new Opcode(cmp, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(dex, Mode.IMPLIED, 1, 2, 0),
		new Opcode(axs, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(cpy, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(cmp, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(dec, Mode.ABSOLUTE, 3, 6, 0),
		new Opcode(dcp, Mode.ABSOLUTE, 0, 6, 0),
		new Opcode(bne, Mode.RELATIVE, 2, 2, 1),
		new Opcode(cmp, Mode.INDIRECT_Y, 2, 5, 1),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(dcp, Mode.INDIRECT_Y, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(cmp, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(dec, Mode.ZERO_PAGE_X, 2, 6, 0),
		new Opcode(dcp, Mode.ZERO_PAGE_X, 0, 6, 0),
		new Opcode(cld, Mode.IMPLIED, 1, 2, 0),
		new Opcode(cmp, Mode.ABSOLUTE_Y, 3, 4, 1),
		new Opcode(nop, Mode.IMPLIED, 1, 2, 0),
		new Opcode(dcp, Mode.ABSOLUTE_Y, 0, 7, 0),
		new Opcode(nop, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(cmp, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(dec, Mode.ABSOLUTE_X, 3, 7, 0),
		new Opcode(dcp, Mode.ABSOLUTE_X, 0, 7, 0),
		new Opcode(cpx, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(sbc, Mode.INDIRECT_X, 2, 6, 0),
		new Opcode(nop, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(isc, Mode.INDIRECT_X, 0, 8, 0),
		new Opcode(cpx, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(sbc, Mode.ZERO_PAGE, 2, 3, 0),
		new Opcode(inc, Mode.ZERO_PAGE, 2, 5, 0),
		new Opcode(isc, Mode.ZERO_PAGE, 0, 5, 0),
		new Opcode(inx, Mode.IMPLIED, 1, 2, 0),
		new Opcode(sbc, Mode.IMMEDIATE, 2, 2, 0),
		new Opcode(nop, Mode.IMPLIED, 1, 2, 0),
		new Opcode(sbc, Mode.IMMEDIATE, 0, 2, 0),
		new Opcode(cpx, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(sbc, Mode.ABSOLUTE, 3, 4, 0),
		new Opcode(inc, Mode.ABSOLUTE, 3, 6, 0),
		new Opcode(isc, Mode.ABSOLUTE, 0, 6, 0),
		new Opcode(beq, Mode.RELATIVE, 2, 2, 1),
		new Opcode(sbc, Mode.INDIRECT_Y, 2, 5, 1),
		new Opcode(kil, Mode.IMPLIED, 0, 2, 0),
		new Opcode(isc, Mode.INDIRECT_Y, 0, 8, 0),
		new Opcode(nop, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(sbc, Mode.ZERO_PAGE_X, 2, 4, 0),
		new Opcode(inc, Mode.ZERO_PAGE_X, 2, 6, 0),
		new Opcode(isc, Mode.ZERO_PAGE_X, 0, 6, 0),
		new Opcode(sed, Mode.IMPLIED, 1, 2, 0),
		new Opcode(sbc, Mode.ABSOLUTE_Y, 3, 4, 1),
		new Opcode(nop, Mode.IMPLIED, 1, 2, 0),
		new Opcode(isc, Mode.ABSOLUTE_Y, 0, 7, 0),
		new Opcode(nop, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(sbc, Mode.ABSOLUTE_X, 3, 4, 1),
		new Opcode(inc, Mode.ABSOLUTE_X, 3, 7, 0),
		new Opcode(isc, Mode.ABSOLUTE_X, 0, 7, 0),
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
	CPU: CPU,
	Opcode: Opcode,
};
