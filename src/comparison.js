'use strict';

module.exports = {
    simple: (a, b) => {
        if (a === b) {
            return 0;
        }
        return a > b ? 1 : -1;
    },

    curryComparer: (comparer, accessor1, accessor2) => {
        const ax2 = accessor2 || accessor1,
            comp = comparer || module.exports.simple;

        return (a, b) => {
            return comp(accessor1(a), ax2(b));
        };
    },

    alwaysEqual: () => 0,
    alwaysGreater: () => 1,
    alwaysLess: () => -1
};
