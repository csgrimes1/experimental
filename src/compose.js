'use strict';

const
    isLiteralType = function (obj) {
        const typeString = typeof(obj) === 'object'
            ? obj.constructor.name.toLowerCase()
            : typeof obj;

        switch (typeString) {
            case 'string':
            case 'number':
            case 'boolean':
                return true;
        }
    },
    construct = function (baseObject) {
        if (baseObject instanceof Array) {
            return [];
        } else if(isLiteralType(baseObject)) {
            return Object.assign(baseObject, {initialized: true});
        }
        return {__proto__: baseObject.__proto__};
    };

module.exports = {
    assign: function (arg1) {
        const rawCopy = construct(arg1),
            argsArray = Array.from(arguments),
            merges = rawCopy.initialized ? argsArray.slice(1) : argsArray,
            pars = [
                rawCopy
            ]
            .concat(merges);

        return Object.assign.apply(null, pars);
    },

    buildObject: function (pairs) {
        let result = {};

        for(let pair of pairs){
            result[pair[0]] = pair[1];
        }
        return result;
    }
};
