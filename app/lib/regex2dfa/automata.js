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

Automata.prototype.addTransition = function (fromState, toState, input) {
    if (_.isString(input)) {
        input = new Set([input]);
    }

    this.states.add(fromState);
    this.states.add(toState);

    if (this.transitions.has(fromState)) {
        var curFromState = this.transitions.get(fromState);
        if (curFromState.has(toState)) {
            // curFromState.get(toState).union(input);
            var curToState = curFromState.get(toState);
            curToState.union(input);
        } else{
            curFromState.add(toState, input);
            //this.transitions.get(fromState).curFromState.add(toState, input);
        }
    } else {
        this.transitions.add(fromState, new Dictionary(toState, input));
    }
};

Automata.prototype.display = function () {
    console.log('states:', this.states);
    console.log('start state:', this.startState);
    console.log('final states:', this.finalStates);
    console.log('transitions:', this.transitions);
    /*var fromStates = this.transitions.keys();
    var lenFromStates = fromStates.length;
    for (var i = 0; i < lenFromStates; i++) {
        console.log(this.transitions.get(fromStates[i]));
        var toStates = fromStates[i].keys();
        var lenToStates = toStates.length;
        for (var j = 0; j < lenToStates; j++) {
            console.log('    ', toStates[j]);
        }
        console.log(''); // new line
    }*/
};
