var testing = false;
let maxErrors = 3;
let numAnswers = 10;
var currentAnswer;
var numError;
var ATOMS = [];

function validateSKNF() {
	var inputFormula = document.getElementById('formula').value;

	if(verificationFormula(inputFormula)) {

		var answer = checkSKNF(inputFormula);

		const SKNF = " является СКНФ";
		document.getElementById("error-string").textContent = "Формула " + (answer === true ? inputFormula + SKNF : inputFormula + " не" + SKNF);
	}else {
		document.getElementById("error-string").textContent = "Не является формулой";

	}
}

function checkSKNF(inputFormula) {
	return checkFormula(inputFormula) === 0;
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
