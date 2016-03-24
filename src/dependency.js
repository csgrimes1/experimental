'use strict';

const nodeInScope = function (scope) {
        let dict = scope.dict;

        return function (name) {
            const n = dict[name];
            if (n) {
                return n;
            }

            return (dict[name] = {
                scope: scope,
                name: name,
                deps: {},
                dependsOn: function (depName) {
                    const otherNode = scope.node(depName);
                    let me = dict[name];

                    if (otherNode.hasDependencyOn(name)) {
                        throw new Error('CIRCULAR_DEPENDENCY');
                    }

                    me.deps[depName] = otherNode;
                    return me;
                },
                hasDependencyOn: function (depName) {
                    let me = dict[name];

                    if (me.deps.hasOwnProperty(depName)) {
                        return true;
                    }

                    for (let k in me.deps) {
                        const dep = me.deps[k];

                        if (dep.hasDependencyOn(depName)) {
                            return true;
                        }
                    }

                    return false;
                }
            });
        };
    },
    sortScope = function (scope) {
        return function () {
            const keys = Object.getOwnPropertyNames(scope.dict);

            return keys.sort( function (a, b) {
                const nodeA = scope.node(a),
                    nodeB = scope.node(b);

                if (nodeA.hasDependencyOn(b)) {
                    return 1;
                } else if (nodeB.hasDependencyOn(a)) {
                    return -1;
                }

                return -1;
            });
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
