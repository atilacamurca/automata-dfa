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
                // https://github.com/siddharthasahu/automata-from-regex/blob/master/AutomataTheory.py#L233
            }
        }
    }

    this.dfa = dfa;
};
