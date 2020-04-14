var testing = false;
let maxErrors = 3;
let numAnswers = 10;
var currentAnswer;
var numError;
var ATOMS = [];

function validateSKNF() {
	var inputFormula = document.getElementById('formula').value;

	var answer = checkSKNF(inputFormula);

	const SKNF = " является СКНФ";
	document.getElementById("error-string").textContent = "Формула " + (answer === true ? inputFormula + SKNF : inputFormula + " не" + SKNF);
}

function checkSKNF(inputFormula) {
	if (hasComplexNegations(inputFormula)) {
        return false;
    }

	if (hasSyntaxErrors(inputFormula)) {
		return false;
	}

	var disjunctions = inputFormula.split("&") || inputFormula;
	disjunctions.forEach(removeRedundantBrackets);
	ATOMS = getUniqueAtomsInFormula(inputFormula);

	var allAtomsUsage = disjunctions.every(isAllAtomsInUsage);
	return allAtomsUsage && !hasDuplicates(disjunctions);
}

function hasComplexNegations(inputFormula) {
	const negation = /!\([^)]+\)/g;
	var hasNegations = inputFormula.match(negation);
	return hasNegations !== null;
}

function hasSyntaxErrors(inputFormula) {
	var balance = 0;
	for(let i = 0; i < inputFormula.length; i++) {
		if(inputFormula[i] === "("){
			balance++;
		}else if(inputFormula[i] === ")"){
			balance--;
		}
	}
	if (balance !== 0){
		return true;
	}
	var subFormula = new RegExp("[A-Z]");
	var regSKNF = /(\(![A-Z]\)|\((([A-Z]|\(![A-Z]\))\|([A-Z]|\(![A-Z]\)))\))/g;
	var regConjunctions = /\([A-Z]&[A-Z]\)/;

	var oldFormula;
	do {
		oldFormula = inputFormula;
		inputFormula = inputFormula.replace(regSKNF, subFormula);
	} while (inputFormula !== oldFormula);

	if (inputFormula.match(subFormula) !== null) {
		return false;
	} else {
		do {
			oldFormula = inputFormula;
			inputFormula = inputFormula.replace(regConjunctions, subFormula);
		} while (inputFormula !== oldFormula);
		return inputFormula.match(subFormula) === null;
	}
}

function hasDuplicates(array) {
	var checked = Object.create(null);
	var check = false;

	array.forEach(
		function(element) {
			if (hasRepeating(element) || isAlreadyInArray(element, checked)) {
				check = true;
				return;
			}
			checked[element] = true;
		});
	return check;
}

function hasRepeating(subFormula) {

	var atom = /[A-Z]|![A-Z]/g;
	var atomsVisited = Object.create(null);
	var atomsSet = subFormula.match(atom);
	var check = false;

	atomsSet.forEach(
		function(element) {
			if (element in atomsVisited) {
				check = true;
				return;
			}
			atomsVisited[element] = true;
		});
	return check;
}

function isAlreadyInArray(disjunction, checked) {
	var LIGAMENT = /\|/g;
	for (var value in checked) {
        var valueSplit = String(value).split(LIGAMENT);
        valueSplit.forEach(removeRedundantBrackets);
        valueSplit.sort();

        var disjunctionSplit = disjunction.split(LIGAMENT);
        disjunctionSplit.forEach(removeRedundantBrackets);
        disjunctionSplit.sort();

        var counter = 0;
        for (var element = 0; element < valueSplit.length; element++) {
            if (areAtomsEqual(valueSplit[element], disjunctionSplit[element])) {
                counter++;
            }
        }

        return counter === valueSplit.length;
    }
	return false;
}

function areAtomsEqual(firstAtom, secondAtom) {
	return extractAtom(firstAtom) === extractAtom(secondAtom);
}

function extractAtom(atom) {
	var matcher = atom.match(/\([A-Z]\)/g);
	if (matcher !== null) {
		return atom[1];
	} else return atom;
}

function isAllAtomsInUsage(element) {
	var elementAtoms = getUniqueAtomsInFormula(element);

	if (ATOMS.length !== elementAtoms.length) {
		return false;
	}

	return ATOMS.every(function (v, i) {
		return v === elementAtoms[i]
	})
}

function removeRedundantBrackets(element, index, inputArray) {
	var open = element.match(/\(/g);
	var openCounter = (open === null) ? 0 : open.length;

	var close = element.match(/\)/g);
	var closeCounter = (close === null) ? 0 : close.length;

	if (closeCounter === openCounter) {
		return;
	}

	var difference = Math.abs(closeCounter - openCounter);
	inputArray[index] = closeCounter > openCounter ? element.slice(0, element.length - difference) : element.slice(difference);
}


function startTest(){
	if(!testing) {
		numError = 0;
		currentAnswer = 0;
		testing = true;
		document.getElementById("formula").disabled = true;
		document.getElementById("generate").hidden = true;
		document.getElementById("compare").hidden = true;
		document.getElementById("startTesting").textContent = "Стоп";
		document.getElementById("startTesting").style.background = "Red";
		document.getElementById("equivalent").hidden = false;
		document.getElementById("nonEquivalent").hidden = false;
		outputRezult("");
		generate();
	}else{
		testing = false;
		document.getElementById("formula").disabled = false;
		document.getElementById("generate").hidden = false;
		document.getElementById("compare").hidden = false;
		document.getElementById("startTesting").textContent = "Старт";
		document.getElementById("startTesting").style.background = "Green";
		document.getElementById("equivalent").hidden = true;
		document.getElementById("nonEquivalent").hidden = true;
	}
}

function setAnswer(answer) {
	var inputFormula = document.getElementById('formula').value;
	currentAnswer++;
	if(answer === checkSKNF(inputFormula)){
		outputRezult("Ответ верный;\t");
	}else {
		numError++;
		outputRezult("Ответ неверный;\t\t");
	}
	generate();
}
function outputRezult(result) {
	var outputCheckTypeFormula = document.getElementById("error-string");
	if(numError !== maxErrors && currentAnswer < numAnswers) {
		outputCheckTypeFormula.innerHTML = `${result}Тест номер ${currentAnswer + 1};\tДопущено ошибок: ${numError};`;
	}else if(numError === maxErrors){
		outputCheckTypeFormula.innerHTML = `Вы не смогли пройти тест, допущено максимальное количество ошибок `;
		startTest();
	}else{
		outputCheckTypeFormula.innerHTML = `Вы успешно прошли тест`;
		startTest();
	}
}
