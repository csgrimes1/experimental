'use strict';

const objects = require('../src/objects');

module.exports = {

    beforeTest: t => {
        return t.createContext('objects', 'objects api', null);
    },

    tests: {
        'should return pairs for all properties in object': context => {
            const result = Array.from(objects.entries({
                    a: 1,
                    b: 2
                }));

            context.equal(result[0][0], 'a', `expect first key`);
        },

        'should return proper type name for values': context => {
            context.equal(objects.typeName(''), 'string');
            context.equal(objects.typeName(), 'undefined');
            context.equal(objects.typeName(null), 'null');
            context.equal(objects.typeName(2), 'number');
            context.equal(objects.typeName(new Date()), 'Date');
            context.equal(objects.typeName(true), 'boolean');
            context.equal(objects.typeName([]), 'Array');
            context.equal(objects.typeName({}), 'object');
        },

        'should determine literal values from reference values': context => {
            let four = 4 + 0.0;

            context.equal(objects.isValueType(4), true);
            context.equal(objects.isValueType(four), true);
            context.equal(objects.isValueType(''), true);
            context.equal(objects.isValueType(true), true);
            context.equal(objects.isValueType(false), true);
            context.equal(objects.isValueType({}), false);
            context.equal(objects.isValueType(), false);
            context.equal(objects.isValueType(null), false);
            context.equal(objects.isValueType([]), false);
        }
    }
};
