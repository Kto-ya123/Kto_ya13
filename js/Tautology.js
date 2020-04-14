function validateTautology() {
    const TAUTOLOGY = " является общезначимой";
    var input = document.getElementById('formula').value;
    var answer = checkForTautology(input);
    document.getElementById("error-string").textContent = "Формула " + (answer === true ? input + TAUTOLOGY : input + " не" + TAUTOLOGY);
}

function checkForTautology(formula) {
    var formulaAtoms = getUniqueAtomsInFormula(formula);
    formulaAtoms.sort();
    var atomsNumber = formulaAtoms.length;
    var n = Math.pow(2, atomsNumber);

    for (var i = 0; i < n; i++) {
        var currentNumber = convertToBinary(i, atomsNumber);
        var modifiedFormula = replaceAtoms(formulaAtoms, currentNumber, formula);
        var answer = calculateFormula(modifiedFormula);
        answer = parseInt(answer);
        if (answer !== 1) {
            return false;
        }
    }
    return true;
}

function convertToBinary(number, numberLength) {
    var binaryNumber = (number >>> 0).toString(2);
    for (var digit = binaryNumber.length; digit < numberLength; digit++) {
        binaryNumber = "0" + binaryNumber;
    }

    return binaryNumber;
}



function replaceAtoms(formulaAtoms, currentNumber, formula) {
    var modifiedFormula = formula;
    for (var iter = 0; iter < formulaAtoms.length; iter++) {
        var atom = formulaAtoms[iter];
        var digit = currentNumber[iter];
        modifiedFormula = modifiedFormula.replace(new RegExp(atom, 'g'), digit);
    }
    return modifiedFormula;
}

function calculateFormula(formula) {
    var regFormula = /(\(![01]\))|(\([01](&|(\|)|(->)|(~))[01]\))/;
    while (regFormula.exec(formula) != null) {
        var subFormula = regFormula.exec(formula)[0];
        var result = calculateSimpleFormula(subFormula);
        formula = formula.replace(subFormula, result);
    }

    return formula;
}

function calculateSimpleFormula(formula) {
    var simpleFormulas = {
        "[!]": negation,
        "[&]": conjunction,
        "[|]": disjunction,
        "[->]": implication,
        "[~]": equivalence
    };

    for (var ligament in simpleFormulas) {
        var searchRes = formula.search(new RegExp(String(ligament)));
        searchRes = parseInt(searchRes);
        if (searchRes !== -1) {
            return simpleFormulas[ligament](formula);
        }
    }
}

function negation(formula) {
    var argument = parseInt(formula[2]);
    return (!argument) ? 1 : 0;
}

function conjunction(formula) {
    var firstArg = parseInt(formula[1]);
    var secondArg = parseInt(formula[3]);
    return (firstArg && secondArg) ? 1 : 0;
}

function disjunction(formula) {
    var firstArg = parseInt(formula[1]);
    var secondArg = parseInt(formula[3]);
    return (firstArg || secondArg) ? 1 : 0;
}

function implication(formula) {
    var firstArg = parseInt(formula[1]);
    var secondArg = parseInt(formula[4]);
    return (firstArg && !secondArg) ? 0 : 1;
}

function equivalence(formula) {
    var firstArg = parseInt(formula[1]);
    var secondArg = parseInt(formula[3]);
    return (firstArg === secondArg) ? 1 : 0;
}
