/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */


export function chunk(array, chunkSize, handle) {
    let i, j, chunk;
    let chunkNum = 0;
    const chunks = [];

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

