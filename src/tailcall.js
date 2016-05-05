'use strict';

const toArray = function (collection) {
    return Array.from(collection);
};

module.exports = function () {
    const a1 = toArray(arguments),
        args = a1.slice(0, a1.length - 1),
        recurseFunc = a1[a1.length -1],
        tail = function () {
            const tailArgs = toArray(arguments).concat([tail]);

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
