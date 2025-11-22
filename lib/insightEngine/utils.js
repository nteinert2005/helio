export function movingAvergae(values, window){
    const result = [];

    for (let i = 0; i < values.length; i++){
        const start = Math.max(0, i -window + i);
        const slice = values.slice(start, i + 1);
        result.push(slice.reduce((a,b) => a+b, 0)/slice.length);
    }

    return result;
}


export function zScore(value, mean, std){
    return (value - mean) / std;
}