'use strict';

const tuple = require('./tuple'),
    compose = require('./compose'),
    objects = require('./objects'),
    select = function () {
        const  ar = Array.from(arguments);

        return {
            [Symbol.iterator]() {  // (*)
                return ar[Symbol.iterator]();
            },

            where: function (predicate) {
                this._filter = predicate;
                return this;
            }
        };
    };

//List comprehension
module.exports = function *comprehensor (collections) {
    const tailArgs = [],
        pairs = Array.from(objects.entries(collections)),
        nullFilter = () => true,
        walk = function *(entries, tailArgs) {
            const k = entries[0][0],
                col = entries[0][1],
                filter = col._filter || nullFilter,
                nextEntries = entries.slice(1);

            for(let v of col){
                const tuples = tailArgs.concat(tuple(k, v)),
                    yieldObj = compose.buildObject(tuples);

                if (filter(yieldObj)) {
                    if (entries.length === 1) {
                        yield yieldObj;
                    } else {
                        yield *walk(nextEntries, tuples);
                    }
                }
            }
        };

    yield *walk(pairs, tailArgs);
};

module.exports.select = select;