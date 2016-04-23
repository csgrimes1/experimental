'use strict';

const tuple = require('./tuple');

module.exports = {
    entries: function *(obj) {
        for(let k of Object.keys(obj)) {
            yield tuple(k, obj[k]);
        }
    },

    typeName: function (obj) {
        const typeName = typeof(obj);

        switch (typeName) {
            case 'object':
                if (obj === null) {
                    return 'null';
                }
                else if (obj.constructor && obj.constructor.name && obj.constructor.name !== 'Object') {
                    return obj.constructor.name;
                }
                return typeName;

            default:
                return typeName;
        }
    },

    isValueType: function (obj) {
        const typeName = module.exports.typeName(obj);

        switch (typeName.toLowerCase()) {
            case 'string':
            case 'number':
            case 'boolean':
                return true;
        }
        return false;
    }

};
