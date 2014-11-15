'use strict';

function BuildAutomata() {}

/**
 * [basicStruct description]
 * @param {String} char [description]
 */
BuildAutomata.basicStruct = function (char) {
    var state1 = 1;
    var state2 = 2;
    var basic = new Automata(new Set(['0', '1']));
    basic.setStartState(state1);
    basic.addFinalStates(state2);
    basic.addTransition(state1, state2, char);
    return basic;
};

/**
 * [starStruct description]
 * @param {Automata} op [description]
 */
BuildAutomata.starStruct = function (op) {
    var aux1 = op.newBuildFromNumber(2);
    op = aux1[0];
    var m1 = aux1[1];

    var state1 = 1;
    var state2 = m1;
    var star = new Automata(new Set(['0', '1']));
    star.setStartState(state1);
    star.addFinalStates(state2);
    star.addTransition(star.startState, op.startState, Automata.epsilon());
    star.addTransition(star.startState, star.finalStates[0], Automata.epsilon());
    star.addTransition(op.finalStates[0], star.finalStates[0], Automata.epsilon());
    star.addTransition(op.finalStates[0], op.startState, Automata.epsilon());
    star.addTransitionDict(op.transitions);
    return star;
};

/**
 * [plusStruct description]
 * @param {Automata} op1 first operator
 * @param {Automata} op2 second operator
 */
BuildAutomata.plusStruct = function (op1, op2) {
    var aux1 = op1.newBuildFromNumber(2);
    op1 = aux1[0];
    var m1 = aux1[1];

    var aux2 = op2.newBuildFromNumber(m1);
    op2 = aux2[0];
    var m2 = aux2[1];

    var state1 = 1;
    var state2 = m2;
    var plus = new Automata(new Set(['0', '1']));
    plus.setStartState(state1);
    plus.addFinalStates(state2);
    plus.addTransition(plus.startState, op1.startState, Automata.epsilon());
    plus.addTransition(plus.startState, op2.startState, Automata.epsilon());
    plus.addTransition(op1.finalStates[0], plus.finalStates[0], Automata.epsilon());
    plus.addTransition(op2.finalStates[0], plus.finalStates[0], Automata.epsilon());
    plus.addTransitionDict(op1.transitions);
    plus.addTransitionDict(op2.transitions);
};

/**
 * [dotStruct description]
 * @param {Automata} op1 first operator
 * @param {Automata} op2 second operator
 */
BuildAutomata.dotStruct = function (op1, op2) {
    var aux1 = op1.newBuildFromNumber(1);
    op1 = aux1[0];
    var m1 = aux1[1];

    var aux2 = op2.newBuildFromNumber(m1);
    op2 = aux2[0];
    var m2 = aux2[1];

    var state1 = 1;
    var state2 = m2 - 1;
    var dot = new Automata(new Set(['0', '1']));
    dot.setStartState(state1);
    dot.addFinalStates(state2);
    dot.addTransition(op1.finalStates[0], op2.startState, Automata.epsilon());
    dot.addTransitionDict(op1.transitions);
    dot.addTransitionDict(op2.transitions);
    return dot;
};
