"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (window) {
    var TYPE_INFO = {
        type: "time",
        name: "Time",
        version: "0.0.1",
        author: "Lobaro",
        kind: "datasource"
    };

    var Datasource = function () {
        function Datasource() {
            _classCallCheck(this, Datasource);
        }

        _createClass(Datasource, [{
            key: "renderTime",
            value: function renderTime() {
                var currentTime = new Date();
                var diem = 'AM';
                var h = currentTime.getHours();
                var m = currentTime.getMinutes();
                var s = currentTime.getSeconds();

                if (h === 0) {
                    h = 12;
                } else if (h > 12) {
                    h = h - 12;
                    diem = 'PM';
                }

                if (m < 10) {
                    m = '0' + m;
                }
                if (s < 10) {
                    s = '0' + s;
                }
                return {
                    hours: h,
                    minutes: m,
                    seconds: s,
                    diem: diem
                };
            }
        }, {
            key: "fetchData",
            value: function fetchData(resolve, reject) {
                var now = new Date();
                resolve([{ date: now }]);
            }
        }]);

        return Datasource;
    }();

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);
})(window);