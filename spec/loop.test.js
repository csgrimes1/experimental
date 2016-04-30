'use strict';

const loop = require('../src/loop');

module.exports = {
    beforeTest: t => {
        return t.createContext('loop', 'loop');
    },

    tests: {
        'top-predicated loop should run fibonacci': context => {
            //1 1 2 3 5 8 13 21 ...
            //0 1 2 3 4 5 6  7
            const lastIndex = 7,
                result = loop.top(
                    //Initialize
                    {back2:0,back1:1},
                    //Loop predicator
                    (__, index) => index < lastIndex,
                    //Finalize result from accumulator at loop's end.
                    accum => accum.back1,
                    //Callback for each round of the loop.
                    (accum) => {
                        return {
                            back2: accum.back1,
                            back1: accum.back2 + accum.back1
                        };
                    }),
                expectedResult = 21;

            context.equal(result, expectedResult, 'expect ', `expect fib(${lastIndex}) to be ${expectedResult}`);
        },

        'bottom-predicated loop should run fibonacci': context => {
            //0 1 1 2 3 5 8 13 21 ...
            //-1 0 1 2 3 4 5 6  7
            const lastIndex = 7,
                result = loop.bottom(
                    //Initialize
                    null,
                    //Finalize result from accumulator at loop's end.
                    accum => accum.back1,
                    //Callback for each round of the loop.
                    (accum) => {
                        return accum ? {
                            back2: accum.back1,
                            back1: accum.back2 + accum.back1
                        } : {back1:1, back2: 0};
                    },
                    //Loop predicator
                    (__, index) =>  index < lastIndex),
                expectedResult = 21;

            context.equal(result, expectedResult, 'expect ', `expect fib(${lastIndex}) to be ${expectedResult}`);
        },

        'top-predicated loop should support 3 parameters': context => {
            const lastIndex = 5000,
                result = loop.top(0, (__, index) => index < lastIndex, accum => accum + 1);

            context.equal(result, lastIndex);
        },

        'bottom-predicated loop should support 3 parameters': context => {
            let rounds = 0;
            const lastIndex = 1,
                result = loop.bottom(null, accum => ++rounds && (accum || 0) + 1, (__, callbacks) => callbacks < lastIndex);

            context.equal(rounds, lastIndex + 1, `expect ${lastIndex} rounds`);
            context.equal(result, lastIndex + 1, `expect result to be ${lastIndex}`);
        }
    }
};
