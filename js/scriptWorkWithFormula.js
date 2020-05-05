var unaryOrBinaryComplexFormula = new RegExp('([(][!]([A-Z]|[0-1])[)])|([(]([A-Z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[0-1])[)])', 'g');
var atomOrConstant = new RegExp('([A-Z]|[0-1])', 'g');
var replaceFormula = "R";
var tempFormula;


function verificationFormula(formula){
    while (formula !== tempFormula ) {
        tempFormula = formula;
        formula = formula.replace(unaryOrBinaryComplexFormula, replaceFormula);
      }
      tempFormula=0;
    var resultType = formula.match(new RegExp(atomOrConstant, 'g'));
    if ((formula.length === 1) && (resultType != null) && (resultType.length === 1)) {
        return true;
    } else {
        return false;
    }
}
