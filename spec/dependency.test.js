'use strict';

const dep = require('../src/dependency');

module.exports = {
    beforeTest: t => {
        const scope = dep.createScope();

        scope.node('a').dependsOn('b');
        scope.node('b').dependsOn('c');
        scope.node('f').dependsOn('e');
        scope.node('d').dependsOn('a');
        scope.node('d').dependsOn('e');

        return t.createContext('dependency', 'dependency', {scope: scope}, 50);
    },

    tests: {
        'create simple dependency': context => {
            const scope = context.userData.scope;

            context.ok(scope.node('a').hasDependencyOn('b'), 'expect a to depend on b');
            context.ok(scope.node('a').hasDependencyOn('c'), 'expect a to depend on c');
            context.equal(scope.node('b').hasDependencyOn('a'), false, 'expect b to not depend on a');
        },

        'dependency processing order': context => {
            const scope = context.userData.scope,
                processingOrder = scope.createProcessingOrder();
            let i = 0;

            for (let k of processingOrder) {
                //make sure there are no 'unprocessed' references in the
                //tail (unprocessed) part of the array.
                const tail = processingOrder.slice(++i),
                    kNode = scope.node(k);
                //console.log(`Key: ${k}  ${tail}`);
                for (let unproc of tail) {
                    context.equal(kNode.hasDependencyOn(unproc), false);
                }
            }
        }
    }
};
