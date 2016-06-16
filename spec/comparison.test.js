'use strict';

const comparison = require('../src/comparison');

module.exports = {
    beforeTest: t => {
         return t.createContext('comparison', 'comparison operations');
    },

    tests: {
        'simple comparison': context => {
            const eqTest = comparison.simple(1, 1),
                ltTest = comparison.simple(0, 1),
                gtTest = comparison.simple(1, 0);

            context.equal(eqTest, 0);
            context.equal(ltTest, -1);
            context.equal(gtTest, 1);
        },
        'always equal': context => {
            const eqTest = comparison.alwaysEqual(1, 1),
                ltTest = comparison.alwaysEqual(0, 1),
                gtTest = comparison.alwaysEqual(1, 0);

            context.equal(eqTest, 0);
            context.equal(ltTest, 0);
            context.equal(gtTest, 0);
        },
        'always greater': context => {
            const eqTest = comparison.alwaysGreater(1, 1),
                ltTest = comparison.alwaysGreater(0, 1),
                gtTest = comparison.alwaysGreater(1, 0);

            context.equal(eqTest, 1);
            context.equal(ltTest, 1);
            context.equal(gtTest, 1);
        },
        'always less': context => {
            const eqTest = comparison.alwaysLess(1, 1),
                ltTest = comparison.alwaysLess(0, 1),
                gtTest = comparison.alwaysLess(1, 0);

            context.equal(eqTest, -1);
            context.equal(ltTest, -1);
            context.equal(gtTest, -1);
        },

        'curried comparer': context => {
            const objA = {
                    a: 1
                },
                objB = {
                    value: {
                        b: 1
                    }
                },
                comparer = comparison.curryComparer(comparison.simple, oa => oa.a, ob => ob.value.b),
                comparisonResult = comparer(objA, objB);

            context.equal(comparisonResult, 0);
        },

        'simple curried comparer': context => {
            const comparer = comparison.curryComparer(null, x => new Date(x)),
                //UNIX Epoch 0 = 1970-01-01
                comparisonResult = comparer(0, '1700-01-01');

            context.ok(comparisonResult > 0);
        }
    }
};
