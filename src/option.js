'use strict';

class Option {
    constructor (val) {
        this._value = val;
        Object.freeze(this);
    }

    *[Symbol.iterator] () {
        if (this.populated) {
            yield this._value;
        }
    }

    get value () {
        return this._value;
    }

    get populated () {
        return this._value !== undefined;
    }

    get empty () {
        return this._value === undefined;
    }

    toJSON () {
        if (this.empty) {
            return {};
        }

        return {
            value: this.value
        };
    }

};

class Some extends Option
{
    constructor (value) {
        super(value);
    }
    toString () {
        return `Some(${this.toJSON()})`;
    }
};

class None extends Option
{
    constructor () {
        super();
    }

    toString () {
        return 'None';
    }
};

module.exports = {
    any: function() {
        const args = Array.from(arguments);

        for (let a of args) {
            switch (a) {
                case undefined:
                case null:
                case false:
                    break;

                default:
                    return Object.freeze(new Some(a));
            }
        }

        return module.exports.none();
    },

    none: function () {
        return Object.freeze(new None());
    },

    from: function(val) {
        return module.exports.any(val);
    }
};
