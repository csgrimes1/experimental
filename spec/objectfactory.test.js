'use strict';

const factory = require('../src/objectfactory');

module.exports = {

    beforeTest: t => {
        return t.createContext('tailcall', 'tail recursion');
    },

    tests: {
        'should yield a cloned Array': context => {
            const text = 'hello world',
                testArray = Object.assign([1, 2, 3], {prop: text}),
                result = factory.merge(testArray);

            context.ok(result instanceof Array, `expect result is an instance of Array`);
            context.equal(result.length, testArray.length, 'expect Array items to be copied');
            context.equal(result[1], testArray[1], 'expect Array items to be equal');
            context.equal(result.prop, text, 'expect extra properties on Array to be copied');
        },
        'should yield a cloned String': context => {
            const testVal = 'hello whirrelled',
                result = factory.merge(testVal);

            context.ok(result instanceof String, `expect result is an instance of String`);
            context.equal(result, testVal, 'expect string to be copied');
        },
        'should yield a clone for an instantiated String': context => {
            const testVal = 'hello whirrelled',
                result = factory.merge(new String(testVal));

            context.ok(result instanceof String, `expect result is an instance of String`);
            context.equal(result, testVal, 'expect string to be copied');
        },
        'should yield a cloned String with extra properties': context => {
            const testVal = 'bar',
                result = factory.merge(testVal, {foo: testVal});

            context.ok(result instanceof String, `expect result is an instance of String`);
            context.equal(result.foo, testVal, 'expect extra property to be copied');
        },
        'should yield many extra properties per Object.assign': context => {
            const testVal = true,
                x = 'hello',
                y = 'world',
                result = factory.merge(new Boolean(testVal), {x: x, y: false}, {y: y});

            context.ok(result instanceof Boolean, `expect result is an instance of Boolean`);
            context.equal(result, testVal, 'expect boolean to be copied');
            context.equal(result.x, x, 'expect extra property to be copied');
            context.equal(result.y, y, 'expect extra property to be copied from rightmost argument');
        },
        'should compose an object with pairs': context => {
            const obj = factory.buildObject([['a', 1], ['b', 2], ['c', 3]]);

            context.deepEqual(obj, {a: 1, b: 2, c: 3}, 'expect object to match pairs');
        }
    }
};
