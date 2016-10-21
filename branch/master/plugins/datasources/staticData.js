"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (window) {
    var TYPE_INFO = {
        type: "static-data",
        name: "Static Data",
        version: "0.0.1",
        author: "Lobaro",
        kind: "datasource",
        description: "Datasource that provides static data",
        settings: [{
            id: "data",
            name: "Data",
            description: "The data that is returned by the datasource, must be an json-array of json-objects",
            type: "json",
            defaultValue: "[]"
        }]
    };

    var Datasource = function () {
        function Datasource() {
            _classCallCheck(this, Datasource);
        }

        _createClass(Datasource, [{
            key: "initialize",
            value: function initialize(props) {
                props.setFetchInterval(Infinity);
                props.setFetchReplaceData(true);
            }
        }, {
            key: "fetchData",
            value: function fetchData(resolve, reject) {
                var settings = this.props.state.settings;
                var data = void 0;
                try {
                    data = JSON.parse(settings.data);

                    if (!_.isArray(data)) {
                        data = [{ error: "'data' must be an array of objects but is " + (typeof data === "undefined" ? "undefined" : _typeof(data)) }];
                    } else if (data.length > 0) {
                        var wrongTypeElem = _.find(data, function (element) {
                            return !_.isPlainObject(data[0]);
                        });
                        if (wrongTypeElem !== undefined) {
                            data = [{ error: "'data' must be an array of objects but contains " + wrongTypeElem + " JSON: " + JSON.stringify(wrongTypeElem) }];
                        }
                    }
                } catch (error) {
                    data = [{ error: "Failed to parse 'data': " + error.message }];
                }

                resolve(data);
            }
        }]);

        return Datasource;
    }();

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);
})(window);