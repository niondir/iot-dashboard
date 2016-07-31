"use strict";

var _chai = require("chai");

var _randomDatasource = require("./randomDatasource");

var RandomSource = _interopRequireWildcard(_randomDatasource);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

describe('Random Datasource', function () {
    var props = { state: { settings: {} } };
    it("Can create instance", function () {
        var randomSource = new RandomSource.Datasource(props);
        randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests
        _chai.assert.isOk(randomSource);
    });

    describe('fetch data', function () {

        it("Can get new value", function () {
            var randomSource = new RandomSource.Datasource(props);
            randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests

            var values = randomSource.getValues();

            _chai.assert.isArray(values);
            _chai.assert.equal(values.length, 1);
            _chai.assert.isAtLeast(values[0].value, 1);
            _chai.assert.isAtMost(values[0].value, 100);
        });

        it("Can get all past value", function () {
            var randomSource = new RandomSource.Datasource(props);
            randomSource.props = props; // also done by Dashboard - we should reuse some factory in tests

            var newValues = randomSource.getValues();
            var values = randomSource.getValues();

            _chai.assert.isArray(values);
            _chai.assert.equal(values.length, 2);
        });
    });
});