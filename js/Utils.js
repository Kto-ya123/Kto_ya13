function getUniqueAtomsInFormula(input) {
    var atom = /[A-Z]/g;
    var results = input.match(atom) || [];
    var uniqueAtom = results.filter(
        function (symbol, index) {
            return results.indexOf(symbol) === index;
        });

    return uniqueAtom.sort();
}