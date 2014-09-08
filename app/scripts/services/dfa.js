'use strict';

/**
 * @ngdoc service
 * @name automataDfaApp.dfa
 * @description
 * # dfa
 * Factory in the automataDfaApp.
 */
angular.module('automataDfaApp')
    .factory('DFA', function () {
        /**
         *
         * @param {[array]} delta      objeto contendo os estados e suas transições
         *     exemplo:
         *     [
         *         {"state": "s1",
         *         "t": [
         *             {"value": "0", "transition": "s2"},
         *             {"value": "1", "transition": "s1"}
         *         ]},
         *         {"state": "s2",
         *         "t": [
         *             {"value": "0", "transition": "s1"},
         *             {"value": "1", "transition": "s2"}
         *         ]
         *     ]
         * @param {[String]} startState [description]
         * @param {[array]} finalStates [description]
         */
        var DFA = function (delta, startState, finalStates) {
            this.delta = delta;
            this.startState = startState;
            this.finalStates = finalStates;
        };

        DFA.prototype.processString = function(str) {
            var currentState = this.startState;
            var len = str.length;
            // percorrer a string passando por todos os elementos
            for (var i = 0; i < len; i++) {
                var value = str[i];
                // percorrer os estados em delta em busca do estado
                var state = _.find(this.delta, function (element) {
                    return element.state === currentState;
                });
                var goTo = _.find(state.t, function (element) {
                    return element.value === value;
                });
                currentState = goTo.transition;
            }

            console.log(currentState);
            return _.contains(this.finalStates, currentState);
        };

        return DFA;
    });
