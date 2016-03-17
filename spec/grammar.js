'use strict';

module.exports = {
    beforeTest: t => {
        const userData = {};

        return t.createContext('shortname', 'long description', userData, 5000/*timeout/ms*/);
    },

    afterTest: context => {
    },

    tests: {
        'description 1': context => {
        }
    }
};
