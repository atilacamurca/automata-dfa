'use strict';

function DFA (nfa) {
    if (! nfa instanceof Automata) {
        throw 'NFA não é instância de Automata';
    }

    this.nfa = nfa;
    this.dfa = null;
}

DFA.prototype.buildDFA = function () {
    var allStates = new Dictionary();
    var eClose = new Dictionary();
    var count = 1;
    var initialState = this.nfa.getEClose(this.nfa.startState);
    eClose.add(this.nfa.startState, initialState);
    var dfa = new Automata(this.nfa.language);
    dfa.setStartState(count);
    var states = [[initialState, count]];
    allStates.add(count, initialState);
    count += 1;

    while (states.length !== 0) {
        var aux = states.pop();
        var state = aux[0];
        var fromIndex = aux[1];

        var language = dfa.language.keys();
        var lenLanguage = language.length;
        for (var i = 0; i < lenLanguage; i++) {
            var char = language[i];
            var trStates = this.nfa.getTransitions(state, char);
            var trStatesKeys = trStates.keys();
            var trStatesKeysLen = trStatesKeys.length;
            for (var j = 0; j < trStatesKeysLen; j++) {
                var s = trStatesKeys[j];
                if (! eClose.has(s)) {
                    eClose.add(s, this.nfa.getEClose(s));
                }
                trStates = trStates.union(eClose.get(s));
            }

            trStatesKeys = trStates.keys();
            trStatesKeysLen = trStatesKeys.length;
            if (trStatesKeysLen !== 0) {
                var values = allStates.values();
                var toIndex = -1;
                if (! trStates.isSubset(values)) {
                    states.push([trStatesKeys, count]);
                    allStates.add(count, trStates);
                    toIndex = count;
                    count += 1;
                } else {
                    var keys = allStates.keys();
                    var lenValues = values.length;
                    for (var k = 0; k < lenValues; k++) {
                        var v = values[k];
                        if (v.equals(trStates)) {
                            toIndex = keys[k];
                            break;
                        }
                    }
                }
                console.log('from:', fromIndex, ', to:', toIndex, ', char:', char);
                dfa.addTransition(fromIndex, toIndex, char);
            }
        }
    }

    var keys2 = allStates.keys();
    var values2 = allStates.values();
    var lenKeys2 = keys2.length;
    for (var m = 0; m < lenKeys2; m++) {
        if (_.contains(values2, this.nfa.finalStates[0])) {
            dfa.addFinalStates(values2);
        }
    }

    this.dfa = dfa;
};
