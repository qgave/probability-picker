function probabilityPicker(e) {
    if (e instanceof Object === false) return null;
    let values = Object.entries(e);
    if (values.length === 0) return undefined;
    if (values.length === 1) return values[0][0];
    values = prepareValues(values);
    if (values === undefined) return;
    return chooseOne(values);
}

function prepareValues(values) {
    values = filterNumbers(values);
    if (values.length === 0) return;
    values = sortValues(values);
    return prepareProbability(values);
}

function filterNumbers(values) {
    const result = [];
    for (let i = 0; i < values.length; i++) {
        if (typeof values[i][1] === 'number' && !Number.isNaN(values[i][1])) {
            result.push(values[i]);
        }
    }
    return result;
}

function sortValues(values) {
    return values.sort((a, b) => a[1] - b[1]);
}

function prepareProbability(values) {
    const sum = sumProbabilities(values);
    if (sum === 0) return;
    if (sum === 100) return values;
    return changeProbability(values, sum);
}

function changeProbability(values, totalProbability) {
    for (let i = 0; i < values.length; i++) {
        values[i][1] = Math.round((values[i][1] / totalProbability) * 100);
    }
    return values;
}

function sumProbabilities(values) {
    let s = 0;
    for (let i = 0; i < values.length; i++) {
        s += values[i][1];
    }
    return s;
}

function chooseOne(values) {
    const num = random(1, 100);
    let count = 0;
    for (let i = 0; i < values.length; i++) {
        count += values[i][1];
        if (num <= count) return values[i][0];
    }
    return values;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

export default probabilityPicker;