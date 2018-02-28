const c = require('../js/cpu.js');

test('CPU should be declared', () => {
    const cpu = new c.CPU();
    expect(cpu).not.toBeNull();
});

test('Setting specific bit to 1')