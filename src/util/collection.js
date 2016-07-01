
export function chunk(array, chunkSize, handle) {
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

