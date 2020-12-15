const operators = ["+", "-", "*", "/"];

export interface Problem {
    var1: number,
    var2: number,
    operator: string,
    solutions: any[],
    solutionIndex: number
}

export function generateProblem() {
    const var1 = 1;
    const var2 = 1;
    const operator = "+"
    const solution = eval(`${var1}${operator}${var2}`);
    const solutions = shuffleArray([solution, 3, 2]);
    const solutionIndex = solutions.find(v => v === solution);
    return {
        var1,
        var2,
        operator,
        solutions,
        solutionIndex
    }
}

function shuffleArray(array: any[]): any[] {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}