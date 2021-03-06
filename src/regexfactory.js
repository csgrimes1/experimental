'use strict';

//Allows reusable tokens to build regexes.
const objects = require('./objects'),
    deps = require('./dependency'),
    tailcall = require('./tailcall'),
    factory = require('./objectfactory'),
    isRegex = function (thing) {
        return thing && typeof thing['compile'] === 'function' && typeof thing['exec'] === 'function';
    },
    getDeps = function (composition) {
        return composition.filter(el => !isRegex(el));
    },
    resolve = function (tokenSet, composition, flags) {
        if (isRegex(composition)) {
            return composition;
        }

        const source = composition.reduce((accum, val) => {
            return accum + (isRegex(val) ? val.source : tokenSet[val].source);
        }, "");
        return new RegExp(source, flags);
    },
    buildPairs =  function (tokenDefs, scope) {
        //Process tail-recursively
        return tailcall(scope.createProcessingOrder(), {}, (tokenNames, tokenSet, tail) => {
            if (tokenNames.length <= 0) {
                return tokenSet;
            }
            const name = tokenNames[0],
                nextSet = factory.merge(tokenSet, {
                    [name]: resolve(tokenSet, tokenDefs[name])
                });

            return tail(tokenNames.slice(1), nextSet);
        });
    };

module.exports = {
    //' $ws $lf $y8 '
    compile: function (tokenDefs) {
        let scope = deps.createScope();
        const pairs = Array.from(objects.entries(tokenDefs));

        pairs.forEach(pair => {
            const deps = getDeps(Array.from(pair[1])),
                nodeName = pair[0];

            deps.forEach(dependency => {
                scope.node(nodeName).dependsOn(dependency);
            });
        });

        const ns = buildPairs(tokenDefs, scope);
        return {
            namespace: ns,
            withFlags: function (flags) {
                return factory.merge({}, this, {flags: flags});
            },
            compose: function () {
                return resolve(ns, Array.from(arguments), this.flags);
            }
        };
    },

    compose: function () {
        return Array.from(arguments);
    }
};
