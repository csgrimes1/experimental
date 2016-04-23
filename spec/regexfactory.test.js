'use strict';

const grammar = require('../src/regexfactory'),
    compose = grammar.compose;

module.exports = {
    beforeTest: t => {
        const userData = {
            numberExpression: compose('positiveInteger', 'operator', 'positiveInteger'),
            operator: /\*|==|\+|\-|\//,
            negativeInteger: compose(/\-/, 'positiveInteger'),
            positiveInteger: /\d./
        };

        return t.createContext('grammar', 'regex compilation to grammatical tokens', userData, 10);
    },

    tests: {
        'should compile token set': context => {
            const regxx = grammar.compile(context.userData);

            context.equal(regxx.namespace.negativeInteger.source, '\\-\\d.', 'expect compiled regex source');
        },
        'should build an expression from token set': context => {
            const regex = grammar.compile(context.userData)
                .compose(/y=/, 'numberExpression');

            context.ok('y=10*2'.match(regex), 'expect regex to match string');
        },
        'should build a case insensitive regexp': context => {
            const regex = grammar.compile(context.userData)
                .withFlags('i')
                .compose(/y=/, 'numberExpression');

            context.ok('Y=10*2'.match(regex), 'expect regex to match string case insensitively');
        }
    }
};
