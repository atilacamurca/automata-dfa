'use strict';

var operators = {
    star: '*',
    plus: '+',
    dot: '.',
    open_b: '(',
    close_b: ')'
};

var regexAlphabet = (function () {
    var data = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    return function (start, stop) {
        start = data.indexOf(start);
        stop = data.indexOf(stop);
        return (!~start || !~stop) ? null : data.slice(start, stop + 1);
    };
}());

function Regex(expression) {
    this.expression = expression;
    this.local_operators = [operators.plus, operators.dot];
    this.alphabet = regexAlphabet('A', '9');
    this.stack = [];
    this.automata = [];
}

Regex.prototype.buildNFA = function () {
    var language = []; // TODO: usar Set();
    var previous = '::e::'; // Automata.epsilon(); // previous inicia como vazio (epsilon)
    var len = this.expression.length;
    for (var i = 0; i < len; i++) {
        var char = this.expression.charAt(i);
        if (_.contains(this.alphabet, char)) { // verifica se char está no alfabeto
            // adiciona na linguagem se já não existir
            if (_.contains(language, char)) {
                language.push(char);
            }

            this.handleCharInLanguage(char, previous);
        } else if (char === operators.open_b) { // verifica se char é "("
            this.handleCharEqOpenB(char, previous);
        } else if (char === operators.close_b) { // verifica se char é ")"
            this.handleCharEqCloseB(char, previous);
        } else if (char === operators.star) { // verifica se char é "*"
            this.handleCharEqStar(char, previous);
        } else if (_.contains(this.local_operators, char)) {
            this.handleCharInLocalOp(char, previous);
        } else {
            throw sprintf('Símbolo "%s" não é permitido.', char);
        }

        previous = char;
    }

    //var stack_len = this.stack.length;
    while (this.stack.length !== 0) {
        var op = this.stack.pop();
        this.processOperator(op);
    }

    var automata_len = this.automata.length;
    if (automata_len > 1) {
        console.log(this.automata);
        throw 'Regex não pode ser compilado, verifique sua expressão.';
    }

    this.nfa = this.automata.pop();
    this.nfa.language = language;
};

Regex.prototype.handleCharInLanguage = function (char, previous) {
    if (previous !== operators.dot &&
            (_.contains(this.alphabet, previous) ||
            _.contains([operators.close_b, operators.star], previous)
            )) {
        this.addOperatorToStack(operators.dot);
    }
    this.automata.push(BuildAutomata.basicStruct(char));
};

Regex.prototype.handleCharEqOpenB = function (char, previous) {
    if (previous !== operators.dot &&
            (_.contains(this.alphabet, previous) ||
            _.contains([operators.close_b, operators.star], previous)
            )) {
        this.addOperatorToStack(operators.dot);
    }
    this.stack.push(char);
};

Regex.prototype.handleCharEqCloseB = function (char, previous) {
    if (_.contains(this.local_operators, previous)) {
        throw sprintf('Erro ao processar "%s" após "%s".', char, previous);
    }

    while (true) {
        if (this.stack.length === 0) {
            throw sprintf('Erro ao processar "%s". Pilha vazia.', char);
        }

        var item = this.stack.pop();
        if (item === operators.open_b) { // varre a pilha até achar um "("
            break;
        } else if (_.contains(this.local_operators, item)) {
            this.processOperator(item);
        }
    }
};

Regex.prototype.handleCharEqStar = function (char, previous) {
    if (_.contains(this.local_operators, previous) ||
            previous === operators.open_b ||
            previous === operators.star) {
        throw sprintf('Erro ao processar "%s" após "%s".', char, previous);
    }
    this.processOperator(char);
};

Regex.prototype.handleCharInLocalOp = function (char, previous) {
    if (_.contains(this.local_operators, previous) ||
            previous === operators.open_b) {
        throw sprintf('Erro ao processar "%s" após "%s".', char, previous);
    }
    this.addOperatorToStack(char);
};

Regex.prototype.addOperatorToStack = function (char) {
    var len = this.stack.length;
    while (true) {
        if (len === 0) {
            break;
        }

        var top = this.stack[len - 1]; // apenas obtem o valor do topo para testá-lo
        if (top === operators.open_b) {
            break;
        }

        if (top === char || top === operators.dot) {
            var op = this.stack.pop();
            this.processOperator(op);
        } else {
            break;
        }
    }

    this.stack.push(char);
};

Regex.prototype.processOperator = function (operator) {
    var len = this.automata.length;
    if (len === 0) {
        throw sprintf('Erro ao processar operador "%s". Pilha vazia.', operator);
    }

    if (operator === operators.star) {
        var item = this.automata.pop();
        this.automata.push(BuildAutomata.starStruct(item));
    } else if (_.contains(this.local_operators, operator)) {
        if (len < 2) {
            throw sprintf('Erro ao processar operador "%s". Operandos inadequados.', operator);
        }

        var op_1 = this.automata.pop();
        var op_2 = this.automata.pop();

        if (operator === operators.plus) {
            this.automata.push(BuildAutomata.plusStruct(op_2, op_1));
        } else if (operator === operators.dot) {
            this.automata.push(BuildAutomata.dotStruct(op_2, op_1));
        }
    }
};
