'use strict';

const toArray = function (collection) {
    return Array.from(collection);
};

module.exports = function (recurseFunc) {
    const args = toArray(arguments).slice(1),
        tail = function () {
            const self = this,
                tailArgs = [tail].concat(toArray(arguments));

            return () => {
                return recurseFunc.apply(null, tailArgs);
            };
        };

    let result = tail.apply(null, args);

    while (typeof result === 'function') {
        result = result.apply();
    }
    return result;
};
