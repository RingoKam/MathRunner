export function randomInArray(array: any[]) {
    return array[randomIndex(array.length - 1)];
}

export function randomIndex(length: number): number {
    return Math.floor((Math.random() * length) + 1);
}