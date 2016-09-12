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
        type: "static-image-widgets",
        name: "Image",
        description: "Display a static image",
        settings: [{
            id: 'datasource',
            name: 'Datasource',
            type: 'datasource'
        }, {
            id: 'url',
            name: 'Image Url',
            type: 'string'
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
                var settings = props.state.settings;

                return React.createElement(
                    "div",
                    { style: { width: '100%', height: '100%' } },
                    React.createElement("img", { style: {
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }, width: "100%", src: settings.url })
                );
            }
        }]);

        return Widget;
    }(React.Component);

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);
})();