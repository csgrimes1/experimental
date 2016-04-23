'use strict';

const objectfactory = require('./objectfactory'),
    tailcall = require('./tailcall'),
    nodeInScope = function (scope) {
        let dict = scope.dict;

        return function (name) {
            const n = dict[name];
            if (n) {
                return n;
            }

            return (dict[name] = {
                scope: scope,
                name: name,
                deps: new Set(),
                dependsOn: function (depName) {
                    const otherNode = scope.node(depName);
                    let me = dict[name];

                    if (otherNode.hasDependencyOn(name)) {
                        throw new Error('CIRCULAR_DEPENDENCY');
                    }

                    me.deps.add(depName);
                    return me;
                },
                hasDependencyOn: function (depName) {
                    let me = dict[name];

                    if (me.deps.has(depName)) {
                        return true;
                    }

                    for (let k of me.deps) {
                        const dep = dict[k];

                        if (dep.hasDependencyOn(depName)) {
                            return true;
                        }
                    }

                    return false;
                }
            });
        };
    },

    hasDeps = function (scope, key, others) {
        const keyNode = scope.node(key);

        for (let other of others) {
            if (keyNode.hasDependencyOn(other)) {
                return true;
            }
        }
        return false;
    },

    splitList = function (scope, keys) {
        return tailcall((tail, listIterator, accum) => {
            if (listIterator.length <= 0) {
                return accum;
            }
            else {
                const head = listIterator[0],
                    unencumbered = !hasDeps(scope, head, keys),
                    newPop = unencumbered ? [head] : [],
                    newKeep = unencumbered ? [] : [head],
                    newAccum = objectfactory.merge( accum, {
                        pop:  accum.pop.concat(newPop),
                        keep: accum.keep.concat(newKeep)
                    });

                return tail(listIterator.slice(1), newAccum);
            }
        }, keys, {pop: [], keep: []});
    },

    sortScope = function (scope) {
        return function () {
            const keys = Object.getOwnPropertyNames(scope.dict);

            //Optimized sorting algorithms do not work because the hasDependency comparison
            //creates a nondeterministic sort. If a...d relate with d being most dependent,
            //and e...g relate in the same way, both the following sorts are legal:
            // a b c d e f g
            // a e b c f g d
            return tailcall((tail, accum) => {
                if (accum.keep.length <= 0) {
                    return accum.pop;
                }

                const splitRes = splitList(scope, accum.keep);

                return tail({
                    pop:  accum.pop.concat(splitRes.pop),
                    keep: splitRes.keep
                });
            }, {pop: [], keep: keys});
        };
    };

module.exports = {
    //A container of variables that depend on each other.
    createScope: function () {
        let  scope = {
            dict: {}
        };
        scope.node = nodeInScope(scope);
        scope.createProcessingOrder = sortScope(scope);

        return scope;
    }
};
