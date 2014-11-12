'use strict';

/**
 * [Automata description]
 * @param {Set} language linguagem do automato, ex. new Set(['0', '1'])
 */
function Automata(language) {
    if (! language instanceof Set) {
        throw 'Linguagem não é instância de Set';
    }

    this.states = new Set();
    this.startState = null;
    this.finalStates = [];
    this.transitions = new Dictionary();
    this.language = language;
}

Automata.epsilon = function () {
    return ':e:';
};

Automata.prototype.setStartState = function (state) {
    this.startState = state;
    this.states.add(state);
};

Automata.prototype.setFinalStates = function (states) {
    if (_.isNumber(states)) {
        states = [states];
    }

    var len = states.length;
    for (var i = 0; i < len; i++) {
        if (! _.contains(this.finalStates, states[i])) {
            this.finalStates.push(states[i]);
        }
    }
};
