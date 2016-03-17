'use strict';

const tuple = require('./tuple');

module.exports = {
    entries: function *(obj) {
        for(let k of Object.keys(obj)) {
            yield tuple(k, obj[k]);
        }
    }
};
