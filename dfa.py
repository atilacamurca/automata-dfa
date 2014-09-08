'''
-------------------------------------------------------
Description: This class provides a VERY simple implementation
of deterministic finite automata. This class can be used
to initialize a simple DFA and check strings to see if a given
string is a member of the language recognized by a DFA.
-------------------------------------------------------
'''

class DFA:

    """
    -------------------------------------------------------
    This constructor initializes an instance of a DFA
    -------------------------------------------------------
    Preconditions:
    set_states (Python set): set of states in the DFA.
    set_alphabet (Python set): set of all possible characters the automaton recognizes.
    transition_state (Python dictionary): the transition fn is represented as follows:
    delta = {(state_i element of set_states, char a element of sigma): new state element of set_states}
    start_state (string): element of set_states.
    set_final_states (Python set): set of accept state. Each element of this set is element of set_states.
    Postconditions:
    Initializes DFA object
    -------------------------------------------------------
    """
    def __init__(self, set_states, set_alphabet, transition_dict, start_state, set_final_states):

        self.Q = set_states
        self.sigma = set_alphabet
        self.delta = transition_dict
        self.q1 = start_state
        self.F = set_final_states

        return

    """
    -------------------------------------------------------
    This function determines if a given string belongs to the language
    recognized by a DFA.
    -------------------------------------------------------
    Preconditions:
    str (Python string): the given string. The function determines if this
    string is recognized by the calling DFA.
    Postconditions:
    returns:
    string_accepted (boolean): True if str is accepted, False otherwise.
    -------------------------------------------------------
    """
    def process_string(self, str):

        current_state = self.q1

        for i in str:
            current_state = self.delta[(current_state, i)]

        if current_state in self.F:
            string_accepted = True
        else:
            string_accepted = False

        return string_accepted



"""
The following parameters specify a DFA D which recgonizes the following language
L(D) = {s | s contains an even number of zeros}
"""

set_states = {"s1", "s2"}
set_alphabet = {"0", "1"}
transition_dict = {("s1","0"): "s2", ("s1","1"):'s1', ("s2","0"):"s1", ("s2","1"):"s2"}
start_state = "s1"
set_final_states = {"s1"}

D = DFA(set_states, set_alphabet, transition_dict, start_state, set_final_states)

str = "100101010110111110101"
print("{0} is accepted by D: {1}" .format(str, D.process_string(str)))
