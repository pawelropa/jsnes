const c = require('../js/cpu.js');

test('CPU should be declared', () => {
    const cpu = new c.CPU();
    expect(cpu).not.toBeNull();
});

test('Opcode should be declared', () => {
    const opcode = new c.Opcode();
    expect(opcode).not.toBeNull();
});
