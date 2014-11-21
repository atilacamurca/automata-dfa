'use strict';

function DFA (nfa) {
    if (! nfa instanceof Automata) {
        throw 'NFA não é instância de Automata';
    }

    this.nfa = nfa;
    this.dfa = null;
}

DFA.prototype.acceptsString = function (string) {
    if (!this.dfa) {
        throw 'execute buildDFA antes.';
    }

    var current = this.dfa.startState;
    var len = string.length;
    for (var i = 0; i < len; i++) {
        var ch = string[i];
        if (ch === Automata.epsilon()) {
            continue;
        }

        var states = this.dfa.getTransitions(current, ch);
        var keys = states.keys();
        if (keys.length === 0) {
            return false;
        }
        current = keys[0];
    }

    if (_.contains(this.dfa.finalStates, current)) {
        return true;
    }
    return false;
};

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

                // values é um array de set, for em todos até achar
                var numNotFound = 0;
                var lenValues = values.length;
                for (var n = 0; n < lenValues; n++) {
                    if (! trStates.isSubset(values[n])) {
                        numNotFound++;
                    }
                }

                if (numNotFound === lenValues) {
                    states.push([trStates, count]);
                    allStates.add(count, trStates);
                    toIndex = count;
                    count += 1;
                } else {
                    var keys = allStates.keys();
                    var lenKeys = keys.length;
                    for (var k = 0; k < lenKeys; k++) {
                        var v = keys[k];
                        if (allStates.get(v).equals(trStates)) {
                            toIndex = v;
                            break;
                        }
                    }
                }
                console.log('from:', fromIndex, ', to:', +toIndex, ', char:', char);
                dfa.addTransition(fromIndex, +toIndex, char);
            }
        }
    }

    var keys2 = allStates.keys();
    var lenKeys2 = keys2.length;
    for (var m = 0; m < lenKeys2; m++) {
        if (allStates.get(keys2[m]).has(this.nfa.finalStates[0])) {
            dfa.addFinalStates(keys2[m]);
        }
    }

    this.dfa = dfa;
};
