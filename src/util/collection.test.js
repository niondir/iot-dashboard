import * as c from './collection'
import {assert} from 'chai'

describe('Collections', function () {
    describe('chunk', function () {
        it("Splits correctly", function () {
            let testChunks = [[1,2,3], [4,5,6], [7,8,9], [10]]

            let chunks = c.chunk([1,2,3,4,5,6,7,8,9,10], 3, (chunk, i) => {
                assert.deepEqual(testChunks[i], chunk);
            });

            assert.deepEqual(testChunks, chunks);
        });

        it("Can deal with null", function () {
            let chunks = c.chunk(null, 3, (chunk, i) => {
                assert.fail("Must not call the callback function");
            });

            assert.deepEqual(chunks, []);
        });

        it("Can deal with undefined", function () {
            let chunks = c.chunk(undefined, 3, (chunk, i) => {
                assert.fail("Must not call the callback function");
            });

            assert.deepEqual(chunks, []);
        });
    });
});