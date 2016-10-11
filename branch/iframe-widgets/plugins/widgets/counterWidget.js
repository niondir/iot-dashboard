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
        type: "counter-widget",
        name: "Counter",
        description: "Displays a button to increase a simple int value",
        settings: [{
            id: 'counter',
            name: 'Counter',
            type: 'number',
            description: "The counter value",
            defaultValue: "10"
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
                var _this2 = this;

                var value = this.counterValue;
                return React.createElement(
                    "div",
                    { style: { width: '100%', height: '100%' } },
                    React.createElement(
                        "p",
                        null,
                        "Value: ",
                        value
                    ),
                    React.createElement(
                        "button",
                        { onClick: function onClick() {
                                _this2.props.updateSetting("counter", value + 1);
                            } },
                        "+1"
                    )
                );
            }
        }, {
            key: "counterValue",
            get: function get() {
                return parseInt(this.props.state.settings.counter);
            }
        }]);

        return Widget;
    }(React.Component);

    // TODO: Move to core, for simple reuse

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);
})();