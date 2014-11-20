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

Automata.prototype.addFinalStates = function (states) {
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
            curFromState.add(toState, curFromState.get(toState).union(input));
            this.transitions.remove(fromState);
            this.transitions.add(fromState, curFromState);
        } else{
            curFromState.add(toState, input);
            this.transitions.add(fromState, curFromState);
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
            this.addTransition(fromState[i], keys[j], state.get(keys[j]));
        }
    }
};

/**
 * [getTransitions description]
 * @param {Array} state [description]
 * @param {String} key   [description]
 * @return {Set}
 * TODO: https://github.com/siddharthasahu/automata-from-regex/blob/master/AutomataTheory.py#L47
 * Refazer este método.
 */
Automata.prototype.getTransitions = function (state, key) {
    if (_.isNumber(state)) {
        state = [state];
    } else if (state instanceof Set) {
        state = state.keys();
    }

    var transitions = new Set();
    var len = state.length;
    for (var i = 0; i < len; i++) {
        var st = state[i] + '';
        var keys = this.transitions.keys();
        if (_.contains(keys, st)) {
            var stKeys = this.transitions.get(st).keys();
            var values = this.transitions.get(st);
            var lenStKeys = stKeys.length;
            for (var j = 0; j < lenStKeys; j++) {
                var tns = stKeys[j];
                if (values.get(tns).has(key)) {
                    transitions.add(tns);
                }
            }
        }
    }
    return transitions;
};

/**
 * [getEClose description]
 * @param {[type]} findState [description]
 * @return {Set}
 */
Automata.prototype.getEClose = function (findState) {
    var allStates = new Set();
    var states = new Set([findState]);
    var keys = states.keys();
    //var len = keys.length;
    while (keys.length !== 0) {
        var state = keys.pop() + '';
        allStates.add(state);
        var trKeys = this.transitions.keys();
        if (_.contains(trKeys, state)) {
            var stKeys = this.transitions.get(state).keys();
            var lenStKeys = stKeys.length;
            //var values = this.transitions.values();
            var values = this.transitions.get(state);
            //var lenValues = values.length;
            for (var j = 0; j < lenStKeys; j++) {
                var tns = stKeys[j];
                if (values.get(tns).has(Automata.epsilon()) &&
                    ! allStates.has(tns)) {
                    states.add(tns);
                    keys = states.keys();
                }
            }
        }
    }
    return allStates;
};

Automata.prototype.newBuildFromNumber = function (startNum) {
    var translations = new Dictionary();
    var keys = this.states.keys();
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        translations.add(keys[i], startNum);
        startNum += 1;
    }

    var rebuild = new Automata(this.language);
    rebuild.setStartState(translations.get(this.startState));
    rebuild.addFinalStates(translations.get(this.finalStates[0]));
    var fromState = this.transitions.keys();
    var toStates = this.transitions.values();
    var lenToStates = toStates.length;
    for (var j = 0; j < lenToStates; j++) {
        var item = toStates[j];
        var keysState = item.keys();
        var lenKeys = keysState.length;
        for (var k = 0; k < lenKeys; k++) {
            var state = keysState[k];
            rebuild.addTransition(translations.get(fromState[j]), translations.get(state), item.get(state));
        }
    }
    return [rebuild, startNum];
};

/**
 * [newBuildFromEquivalentStates description]
 * @param {Dictionary} equivalent [description]
 * @param {Dictionary} pos        [description]
 */
Automata.prototype.newBuildFromEquivalentStates = function (equivalent, pos) {
    var rebuild = new Automata(this.language);
    var fromState = this.transitions.keys();
    var toStates = this.transitions.values();
    var lenToStates = toStates.length;
    for (var j = 0; j < lenToStates; j++) {
        var item = toStates[j];
        var keysState = item.keys();
        var lenKeys = keysState.length;
        for (var k = 0; k < lenKeys; k++) {
            var state = keysState[k];
            rebuild.addTransition(pos.get(fromState[j]), pos.get(state), toStates.get(state));
        }
    }
    rebuild.setStartState(pos.get(this.startState));
    var lenFinalStates = this.finalStates.length;
    for (var i = 0; i < lenFinalStates; i++) {
        var s = this.finalStates[i];
        rebuild.addFinalStates(pos.get(s));
    }
    return rebuild;
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
