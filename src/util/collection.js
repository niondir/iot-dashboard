export function valuesOf(obj, keyField) {
    if (!obj) {
        return []
    }
    if (keyField) {
        return Object.keys(obj).map(key => {
            return {...obj[key], [keyField]: key}
        })
    }
    return Object.keys(obj).map(key => obj[key])
}

export function chunk(array:array, chunkSize:number, handle:Function) {
    let i, j, chunk;
    let chunkNum = 0;
    let chunks = [];

    if (!array) {
        return chunks;
    }
    for (i = 0, j = array.length; i < j; i += chunkSize) {
        chunk = array.slice(i, i + chunkSize);
        if (handle) {
            handle(chunk, chunkNum);
        }
        chunkNum++;
        chunks.push(chunk);
    }
    return chunks;
}

