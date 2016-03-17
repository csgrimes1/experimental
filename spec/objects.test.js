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
        }
    }
};
