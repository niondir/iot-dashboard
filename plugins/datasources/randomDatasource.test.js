/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from "chai";
import * as RandomSource from "./randomDatasource";

describe('Random Datasource', function () {
    const props = {state: {settings: {}}};
    it("Can create instance", function () {
        const randomSource = new RandomSource.Datasource(props);
        randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests
        assert.isOk(randomSource);
    });

    describe('fetch data', function () {

        it("Can get new value", function () {
            const randomSource = new RandomSource.Datasource(props);
            randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests

            const values = randomSource.getValues();

            assert.isArray(values);
            assert.equal(values.length, 1);
            assert.isAtLeast(values[0].value, 1);
            assert.isAtMost(values[0].value, 100);
        });

        it("Can get all past value", function () {
            const randomSource = new RandomSource.Datasource(props);
            randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests

            const newValues = randomSource.getValues();
            const values = randomSource.getValues();

            assert.isArray(values);
            assert.equal(values.length, 2);
        });

    })
});

