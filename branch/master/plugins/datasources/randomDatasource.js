"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function () {

    var TYPE_INFO = {
        type: "random",
        name: "Random",
        version: "0.0.1",
        author: "Lobaro",
        kind: "datasource",
        description: "A datasource that provides a random value each tick",
        settings: [{
            id: "min",
            name: "Min Value",
            type: "number",
            defaultValue: 0
        }, {
            id: "max",
            name: "Max Value",
            type: "number",
            defaultValue: 100
        }]
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var Datasource = function () {
        function Datasource() {
            _classCallCheck(this, Datasource);
        }

        _createClass(Datasource, [{
            key: "initialize",
            value: function initialize(props) {
                props.setFetchInterval(1200);
                var history = props.state.data;
                // Initialize with non random values to demonstrate loading of historic values
                this.history = history || []; // [{value: 10}, {value: 20}, {value: 30}, {value: 40}, {value: 50}]
                this.x = 0;

                if (this.history.length > 1) {
                    this.x = history[history.length - 1].x + 1 || 0;
                }
            }
        }, {
            key: "datasourceWillReceiveProps",
            value: function datasourceWillReceiveProps(props) {}
        }, {
            key: "fetchData",
            value: function fetchData(resolve, reject) {
                resolve(this.fetchValue());
            }
        }, {
            key: "getValues",
            value: function getValues() {
                this.history.push(this.fetchValue());

                var maxValues = Number(this.props.state.settings.maxValues) || 1000;
                while (this.history.length > maxValues) {
                    this.history.shift();
                }

                return this.history;
            }
        }, {
            key: "fetchValue",
            value: function fetchValue() {
                var settings = this.props.state.settings;
                var min = Number(settings.min || 0);
                var max = Number(settings.max || 100);
                var newValue = { x: this.x++, value: getRandomInt(min, max), value2: getRandomInt(min, max) };
                return newValue;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.history = [];
                console.log("Random Datasource destroyed");
            }
        }]);

        return Datasource;
    }();

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);
})(window);