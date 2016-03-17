'use strict';

const permute = require('../src/permute'),
    select = permute.select;

module.exports = {

    beforeTest: t => {
        return t.createContext('permute', 'permute comprehension', null);
    },

    tests: {
        'permute comprehension should return all combinations of simple arrays': context => {
            const gen = permute({
                    a: [1, 2],
                    b: ['a', 'b']
                }),
                ar = Array.from(gen);

            context.equal(ar.length, 4, `expect correct number of permutations`);
        },
        'permute comprehension should return filtered combinations': context => {
            const gen = permute({
                    c: select(11, 12).where(() => true),
                    d: select(12, 13, 14).where(permutation => {
                        return permutation.d > permutation.c;
                    })
                }),
                ar = Array.from(gen);

            context.equal(ar.length, 5, `expect correct number of permutations`);
            context.deepEqual(ar[3], {c:12, d:13}, `expect correct number of permutations`);
        },
        'select should return an iterable': context => {
            const col = select(1, 2, 3).where(() => false),
                ar = Array.from(col);

            for(let n of col){}
            context.equal(ar.length, 3);
            context.equal(ar[1], 2);
        }
    }
};
