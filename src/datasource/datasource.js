import {assert} from 'chai'
import DatasourcePlugins from './datasourcePlugins'

const initialDatasources = {
    "my-random": {
        id: "my-random",
        type: "random",
        name: "Random Datasource"
    }
};

export function add(a, b) {
    return a + b;
}

describe('Test Datasource', function() {
    describe('#test()', function () {
        it('It should return the sum of two values', function () {
            assert.equal(11, add(5,6));
            assert.equal(5, add(-1,6));
            assert.equal(6, add(0,6));
        });
    });
});


