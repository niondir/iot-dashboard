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
        type: "text",
        name: "Text",
        version: "0.0.1",
        author: "Lobaro",
        kind: "widget",
        description: "Display content of a datasource as plain text",
        settings: [{
            id: 'datasource',
            name: 'Datasource',
            type: 'datasource',
            description: "Datasource to get the text"
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

                return React.createElement(
                    "div",
                    { style: { width: '100%', height: '100%' } },
                    React.createElement("textarea", { style: { padding: "0px", border: 'none', width: '100%', height: '100%', resize: 'none' },
                        readOnly: true,
                        value: JSON.stringify(data) })
                );
            }
        }]);

        return Widget;
    }(React.Component);

    // TODO: Move to core, for simple reuse


    var Prop = React.PropTypes;
    Widget.propTypes = {
        getData: Prop.func.isRequired,
        state: Prop.shape({
            height: Prop.number.isRequired,
            id: Prop.string.isRequired
        }).isRequired
    };

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);
})();