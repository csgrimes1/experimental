'use strict';

const option = require('../src/option');

module.exports = {
    beforeTest: t => {
        const userData = {};

        return t.createContext('option', 'option');
    },

    tests: {
        'should construct Some for logically truthy values': context => {
            context.equal(option.from(false).empty, true, 'Option(false) is empty');
            context.equal(option.from(null).populated, false, 'Option(null) is not populated');
            context.equal(option.from().empty, true, 'Option(undefined) is empty');
            context.equal(option.from('').populated, true, 'Option("") is populated');
            context.equal(option.from(0).populated, true, 'Option(0) is populated');
            context.equal(option.from({}).populated, true, 'Option({}) is populated');
            context.equal(option.from(true).populated, true, 'Option(true) is populated');
        },

        'should create JSON representation of Some': context => {
            const val = option.from(1);

            context.deepEqual(val.toJSON(), {value: 1});
        },

        'should create string representation of Some': context => {
            const val = option.from(2),
                obj = {value: val};

            context.deepEqual(val.toString(), `Some(${obj})`);
        },

        'should create JSON representation of None': context => {
            context.deepEqual(option.none().toJSON(), {});
        },

        'should create string representation of None': context => {
            context.deepEqual(option.none().toString(), 'None');
        },

        'should create Some with first logically truthy value': context => {
            context.equal(option.any(null, false, undefined, 'first', 1, true).value, 'first');
        },

        'Some should be an iterable of length 1': context => {
            const val = option.from(true);
            let count = 0;

            for (let x of val) {
                count++;
            }

            context.equal(count, 1);
        },

        'None should be an iterable of length 0': context => {
            const val = option.none();
            let count = 0;

            for (let x of val) {
                count++;
            }

            context.equal(count, 0);
        }
    }
};
