"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function () {

    var TYPE_INFO = {
        type: "demo-fruit",
        name: "Fruit",
        description: "Display fruits based on color values",
        settings: [{
            id: 'datasource',
            name: 'Datasource',
            type: 'datasource'
        }]
    };

    var Widget = function (_React$Component) {
        _inherits(Widget, _React$Component);

        function Widget() {
            _classCallCheck(this, Widget);

            return _possibleConstructorReturn(this, (Widget.__proto__ || Object.getPrototypeOf(Widget)).apply(this, arguments));
        }

        _createClass(Widget, [{
            key: "render",
            value: function render() {
                var props = this.props;
                var data = props.getData(props.state.settings.datasource);

                if (!data || data.length == 0) {
                    return React.createElement(
                        "p",
                        null,
                        "No data"
                    );
                }

                var value = data[data.length - 1];

                if (!value) {
                    return React.createElement(
                        "p",
                        null,
                        "Invalid Value ",
                        JSON.stringify(value)
                    );
                }

                var fruits = [{
                    name: "Kokus",
                    color: { "col_R": 174, "col_G": 155, "col_B": 108 },
                    img: "fruits/kokus.jpg"
                    // {"col_R":91,"col_G":67,"col_C":217,"col_B":41,"
                }, {
                    name: "Apfel",
                    color: { "col_R": 192, "col_G": 188, "col_B": 118 },
                    img: "/fruits/apfel.png"
                    //"col_R":125,"col_G":131,"col_C":255,"col_B":60,"
                }, {
                    name: "Orange",
                    color: { "col_R": 255, "col_G": 187, "col_B": 120 },
                    img: "/fruits/orange.jpg"
                    // "col_R":255,"col_G":130,"col_C":255,"col_B":61,"
                    //{"col_R":221,"col_G":111,"col_C":255,"col_B":52,"
                }, {
                    name: "Tomate",
                    color: { "col_R": 167, "col_G": 150, "col_B": 106 },
                    img: "/fruits/tomate.jpg"
                    // "col_R":87,"col_G":58,"col_C":197,"col_B":37,"
                }, {
                    name: "Zitrone",
                    color: { "col_R": 255, "col_G": 224, "col_B": 137 },
                    img: "/fruits/zitrone.jpg"
                    // "col_R":239,"col_G":202,"col_B":125,"
                    // "col_R":255,"col_G":236,"col_B":147,"
                }];

                try {
                    var results = _.filter(fruits, function (f) {
                        return _.inRange(f.color.col_R, value.col_R - 10, value.col_R + 10) && _.inRange(f.color.col_G, value.col_G - 10, value.col_G + 10) && _.inRange(f.color.col_B, value.col_B - 10, value.col_B + 10);
                    });

                    return React.createElement(
                        "div",
                        { style: {
                                width: '100%',
                                height: '100%'
                            } },
                        React.createElement(
                            "p",
                            null,
                            _.map(results, function (r) {
                                return r.name;
                            }).join()
                        ),
                        results.length ? React.createElement("img", {
                            style: {
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto"
                            },

                            height: "100%", src: results[0].img }) : null
                    );
                } catch (error) {
                    console.error(error);
                    return React.createElement(
                        "div",
                        null,
                        error.message
                    );
                }
            }
        }]);

        return Widget;
    }(React.Component);

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);

    function rgb2hsv() {
        var rr = void 0;
        var gg = void 0;
        var bb = void 0;
        var r = arguments[0] / 255;
        var g = arguments[1] / 255;
        var b = arguments[2] / 255;
        var h = void 0;
        var s = void 0;
        var v = Math.max(r, g, b);
        var diff = v - Math.min(r, g, b);
        var diffc = function diffc(c) {
            return (v - c) / 6 / diff + 1 / 2;
        };

        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            } else if (g === v) {
                h = 1 / 3 + rr - bb;
            } else if (b === v) {
                h = 2 / 3 + gg - rr;
            }
            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }
})();