'use strict';

const grammar = require('../src/grammar'),
    compile = grammar.compile,
    compose = grammar.compose;

module.exports = {
    beforeTest: t => {
        const userData = {
            negativeInteger: compose(/\-/, 'positiveInteger'),
            positiveInteger: /\d./
        };

        return t.createContext('grammar', 'regex compilation to grammatical tokens', userData, 5000/*timeout/ms*/);
    },

    tests: {
        'should compile token set': context => {
            const regxx = grammar.compile(context.userData);

            context.equal(regxx.namespace.negativeInteger.source, '\\-\\d.', 'expect compiled regex source');
        }
    }
};
