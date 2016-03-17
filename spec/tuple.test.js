'use strict';

const tuple = require('../src/tuple');

module.exports = {

    beforeTest: t => {
        return t.createContext('tuple', 'tuple creation and iteration', null);
    },

    tests: {
        'tuple should create an indexed object': context => {
            const t = tuple('a', 'z', 3);

            context.equal('a', t[0], `expect first member present`);
            context.equal('z', t[1], `expect second member present`);
            context.equal(3, t[2], `expect third member present`);
            context.equal(undefined, t[3], `expect fourth member undefined`);
            context.equal(3, t.length, `expect length to be correct`);
            context.equal(['a', 'z', '3'].toString(), t.toString(), 'expect toString to return a value');
        },

        'tuple should be iterable': context => {
            const arg1 = 'x',
                arg2 = {},
                arg3 = 4,
                argsArray = [arg1, arg2, arg3],
                t = tuple(arg1, arg2, arg3);
            let count = 0;

            for(let v of t){
                context.equal(v.toString(), argsArray[count].toString(), 'expect iterated value');
                count++;
            }
            context.equal(count, argsArray.length, 'expect count to equal length');
        }
    }
};
