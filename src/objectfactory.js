'use strict';

const objects = require('./objects'),
    construct = function (baseObject) {
        if (baseObject instanceof Array) {
            return [];
        } else if(objects.isValueType(baseObject)) {
            //Box the value type.
            return Object.assign(baseObject, {initialized: true});
        }
        return {__proto__: baseObject.__proto__};
    };

module.exports = {
    //Immutable equivalent of Object.assign or lodash.merge.
    merge: function (arg1) {
        const rawCopy = construct(arg1),
            argsArray = Array.from(arguments),
            merges = rawCopy.initialized ? argsArray.slice(1) : argsArray,
            pars = [
                rawCopy
            ]
            .concat(merges);

        return Object.assign.apply(null, pars);
    },

    //Build an object from a set of pairs, where each pair
    //is an array-like object in the following format: [key, value].
    buildObject: function (pairs) {
        const args = [{}].concat(
            pairs.map(p => ({[p[0]]: p[1]}))
        );

        return module.exports.merge.apply(null, args);
    }
};
