'use strict';

const tailcall = require('../src/tailcall')

module.exports = {

    beforeTest: t => {
        return t.createContext('tailcall', 'tail recursion', null);
    },

    tests: {
        'tailcall routine should yield a count': context => {
            const rounds = 1000,
                result = tailcall((tail, accum, index, stop) => {
                    if (index >= stop) {
                        return accum ;
                    }

                    return tail(accum + 1, index + 1, stop);
                }, 0, 0, rounds);

            context.equal(result, rounds, `expect ${rounds} as the final result`);
        }
    }
};
