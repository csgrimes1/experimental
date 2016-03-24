'use strict';

//Allows reusable tokens to build regexes.
const objects = require('./objects'),
    deps = require('./dependency'),
    tailcall = require('./tailcall'),
    composeModule = require('./compose'),
    isRegex = function (thing) {
        return thing && typeof thing['compile'] === 'function' && typeof thing['exec'] === 'function';
    },
    getDeps = function (composition) {
        if (isRegex(composition)){
            return [];
        }
        return composition.filter(el => !isRegex(el));
    },
    resolve = function (tokenSet, composition) {
        if (isRegex(composition)) {
            return composition;
        }

        const source = composition.reduce((accum, val) => {
            return accum + (isRegex(val) ? val.source : tokenSet[val].source);
        }, "");
        return new RegExp(source);
    },
    buildPairs =  function (tokenDefs, scope) {
        //Process tail-recursively
        return tailcall((tail, tokenNames, tokenSet) => {
            if (tokenNames.length <= 0) {
                return tokenSet;
            }
            const name = tokenNames[0],
                nextSet = composeModule.assign(tokenSet, {
                    [name]: resolve(tokenSet, tokenDefs[name])
                });

            return tail(tokenNames.slice(1), nextSet);
        }, scope.createProcessingOrder(), {});
    }

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
            compose: function () {
                return resolve(ns, Array.from(arguments));
            }
        };
    },

    compose: function () {
        return Array.from(arguments);
    }
};
