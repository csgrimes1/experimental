'use strict';

const tailcall = require('./tailcall');

module.exports = {
    //Predicated at top, before callback.
    top: function (initializer, predicate, finalizeResult /*optional*/, callback) {
        //Support the 3 argument version.
        if (arguments.length < 4) {
            const ar = Array.from(arguments);

            return module.exports.top(ar[0], ar[1], result => result, ar[2]);
        }

        return tailcall(initializer, 0, (accum, loopIndex, tail) => {
            if (!predicate(accum, loopIndex)) {
                return finalizeResult(accum);
            }

            return tail(callback(accum, loopIndex), loopIndex + 1);
        });
    },

    //Predicated at bottom, after callback. Callback always gets called at least one time.
    bottom: function (initializer, finalizeResult /*optional*/, callback, predicate) {
        //Support the 3 argument version.
        if (arguments.length < 4) {
            const ar = Array.from(arguments);

            return module.exports.bottom(ar[0], result => result, ar[1], ar[2]);
        }

        return tailcall(initializer, 0, (accum, loopIndex, tail) => {
            const nextAccum = callback(accum, loopIndex);
            if (!predicate(nextAccum, loopIndex)) {
                return finalizeResult(nextAccum);
            }

            return tail(nextAccum, loopIndex + 1);
        });
    }
};
