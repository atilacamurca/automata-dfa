
var regex = new Regex('(01*1)*1');
regex.buildNFA();
var dfa = new DFA(regex.nfa);
dfa.buildDFA();
dfa.dfa;
