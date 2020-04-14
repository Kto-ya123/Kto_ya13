var SYMBOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var NEGATION = "!";
var CONJUNCTION = "&";
var DISJUNCTION = "|";
var OPENING_BRACKET = "(";
var CLOSING_BRACKET = ")";
var Formula;

function newFormula() {
    var type = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    switch (type) {
        case 1:
            var answer = Math.floor(Math.random() * (25 - 0 + 1)) + 0;
            Formula = SYMBOLS[answer];
            break

        case 2:
            Formula = newFormula();
            Formula = OPENING_BRACKET + NEGATION + Formula + CLOSING_BRACKET
            break

        case 3:
            var relation = "";
            var type = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
            switch (type) {
                case 1:
                    relation = CONJUNCTION
                    break

                case 2:
                    relation = DISJUNCTION
                    break
            }

            var leftFormula = newFormula();
            var rightFormula = newFormula();
            Formula = OPENING_BRACKET + leftFormula + relation + rightFormula + CLOSING_BRACKET;
            break
    }
    return Formula;
}

function generate() {
    document.getElementById("formula").value = newFormula();
}
