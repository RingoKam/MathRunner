import { randomInArray, randomIndex } from './Random';

const operators = ["+", "-", "*", "/"];

export interface Problem {
    var1: number,
    var2: number,
    operator: string,
    solutions: any[],
    solutionIndex: number
}

export function generateProblem() {
    const var1 = randomIndex(10);
    const var2 = randomIndex(10);
    const operator = randomInArray(operators);
    try {
        const solution = round(eval(`${var1}${operator}${var2}`));
        const fake1 = generateFake([solution]);
        const fake2 = generateFake([solution, fake1]);
        const solutions = shuffleArray([fake1, solution, fake2]);
        const solutionIndex = solutions.findIndex(v => v == solution);
        if(solutionIndex == -1) {
            debugger;
        }
        return {
            var1,
            var2,
            operator,
            solutions,
            solutionIndex
        }
    } catch (error) {
        console.error(`${var1}${operator}${var2}`);
        console.error(error);
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

function round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

function generateFake(answer: number[]) {
    const fake = randomIndex((answer[0] + 10)  * 2);
    if(answer.includes(fake)) {
        return generateFake(answer);
    } else {
        return fake;
    }
}