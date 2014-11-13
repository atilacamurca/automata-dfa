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

Automata.prototype.addTransitionDict = function (transitions) {
    var fromState = transitions.keys();
    var toStates = transitions.values();
    var lenFromState = fromState.length;
    //var lenToStates = toStates.length;
    for (var i = 0; i < lenFromState; i++) {
        var state = toStates[i];
        var keys = state.keys();
        var len = keys.length;
        for (var j = 0; j < len; j++) {
            // TODO verificar possíveis problemas com esse método!!!!!!!!!
            this.addTransition(fromState[i], keys[j], state.get(keys[i]));
        }
    }
};

Automata.prototype.getTransitions = function (state, key) {
    if (_.isNumber(state)) {
        state = [state];
    }

    var transitions = new Set();
    var len = state.length;
    for (var i = 0; i < len; i++) {
        var st = state[i];
        var keys = this.transitions.keys();
        if (_.contains(keys, st)) {
            var values = this.transitions.values();
            var lenValues = values.length;
            for (var j = 0; j < lenValues; j++) {
                var tns = values[j];
                var setKeys = tns.keys();
                if (_.contains(setKeys, key)) {
                    transitions.add(tns);
                }
            }
        }
    }
    return transitions;
};

Automata.prototype.getEClose = function (findState) {
    var allStates = new Set();
    var states = new Set([findState]);
    var keys = states.keys();
    var len = keys.length;
    while (len !== 0) {
        var state = states.pop();
        allStates.add(state);
        var trKeys = this.transitions.keys();
        if (_.contains(trKeys, state)) {
            var values = this.transitions.values();
            var lenValues = values.length;
            for (var j = 0; j < lenValues; j++) {
                var tns = trKeys[j];
                var aux = values[j];
                var setKeys = aux.keys();
                if (setKeys.has(Automata.epsilon()) &&
                    ! _.contains(allStates, tns)) {
                    states.add(tns);
                }
            }
        }
    }
    return allStates;
};

Automata.prototype.display = function () {
    console.log('states:', this.states);
    console.log('start state:', this.startState);
    console.log('final states:', this.finalStates);
    console.log('transitions:');

    var fromState = this.transitions.keys();
    var toStates = this.transitions.values();
    var lenToStates = toStates.length;
    for (var i = 0; i < lenToStates; i++) {
        var state = toStates[i];
        console.log(fromState[i], state);
    }
};
