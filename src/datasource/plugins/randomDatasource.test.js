import {assert} from "chai";
import * as RandomSource from "./randomDatasource";

describe('Random Datasource', function () {
    const props = {state: {settings: {}}};
    it("Can create instance", function () {
        let randomSource = new RandomSource.Datasource(props);
        randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests
        assert.isOk(randomSource);
    });

    describe('fetch data', function () {

        it("Can get new value", function () {
            let randomSource = new RandomSource.Datasource(props);
            randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests

            let values = randomSource.getValues();

            assert.isArray(values);
            assert.equal(values.length, 1);
            assert.isAtLeast(values[0].value, 1);
            assert.isAtMost(values[0].value, 100);
        });

        it("Can get all past value", function () {
            let randomSource = new RandomSource.Datasource(props);
            randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests

            let newValues = randomSource.getValues();
            let values = randomSource.getValues();

            assert.isArray(values);
            assert.equal(values.length, 2);
        });

    })
});