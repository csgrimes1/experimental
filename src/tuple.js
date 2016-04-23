'use strict';

class Tuple {
    constructor (members) {
        Object.assign(this, Array.from(members));
        this._length = members.length;
        Object.freeze(this);
    }

    get length () {
        return this._length;
    }

    *[Symbol.iterator] () {
        for (let n=0; n<this.length; n++) {
            yield this[n];
        }
    }

    toJSON () {
        return Array.from(this);
    }

    toString () {
        return `${this.toJSON()}`;
    }
};

module.exports = function () {
    return Object.freeze(new Tuple(Array.from(arguments)));
};
