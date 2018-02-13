const fs = require('fs');

var cpu = (function a() {
    'use strict';
    var acc,
        x,
        y,
        sp,
        sf,
        PC = 0x0000;
    var foo = function () {
        console.log(acc);
    };

    return {
        foo: foo
    }
})();
cpu.foo();
