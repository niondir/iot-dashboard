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
        type: "c3-gauge",
        name: "C3 Gauge",
        version: "0.0.2",
        author: "Lobaro",
        kind: "widget",
        description: "Renders a Gauge using the C3 library. The gauge always shows a property from the last datasource value.",
        dependencies: ["https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js", "https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js", "https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css"],
        settings: [{
            id: 'datasource',
            name: 'Datasource',
            type: 'datasource',
            description: "The data source from which the last value is used as gauge value (you can specify a dataPath below)."
        }, {
            id: 'dataPath',
            type: "string",
            name: "Data Path",
            description: "The path to get the data from the last data source value, e.g. nested.array[4] - do not use quoted between []",
            defaultValue: ''
        }, {
            id: 'min',
            type: "number",
            name: "Min value",
            description: "Set min value of the gauge.",
            defaultValue: 0
        }, {
            id: 'max',
            type: "number",
            name: "Max value",
            description: "Set max value of the gauge.",
            defaultValue: 100
        }, {
            id: 'units',
            type: "string",
            name: "Units",
            description: "Set units of the gauge.",
            defaultValue: " %"
        }, {
            id: 'useRatio',
            type: "boolean",
            name: "Show Percentage",
            description: "Do not show the value but the percentage based on min and max.",
            defaultValue: false
        }, {
            id: 'showLabel',
            type: "boolean",
            name: "Show Label",
            description: "Show or hide label on gauge.",
            defaultValue: true
        }, {
            id: 'colors',
            type: "json",
            name: "Colors (left to right)",
            description: "Array of color values from left to right.",
            defaultValue: '["#FF0000","#F97600","#F6C600","#60B044"]'
        }, {
            id: 'colorThreshold',
            type: "json",
            name: "Color Threshold (left to right)",
            description: "Thresholds to change colors.",
            defaultValue: "[10, 60, 90, 100]"
        }]
    };

    function safeParseJsonArray(string) {
        try {
            return JSON.parse(string);
        } catch (e) {
            console.error("Was not able to parse JSON: " + string);
            return [];
        }
    }

    var Widget = function (_React$Component) {
        _inherits(Widget, _React$Component);

        function Widget() {
            _classCallCheck(this, Widget);

            return _possibleConstructorReturn(this, (Widget.__proto__ || Object.getPrototypeOf(Widget)).apply(this, arguments));
        }

        _createClass(Widget, [{
            key: "componentDidMount",
            value: function componentDidMount() {
                this._createChart(this.props);
            }
        }, {
            key: "componentWillReceiveProps",
            value: function componentWillReceiveProps(nextProps) {
                if (nextProps.state.settings !== this.props.state.settings || nextProps.state.height !== this.props.state.height) {
                    this._createChart(nextProps);
                }
            }
        }, {
            key: "componentDidUpdate",
            value: function componentDidUpdate() {
                this._renderChart();
            }
        }, {
            key: "getData",
            value: function getData() {
                var props = this.props;
                var settings = props.state.settings;
                var data = props.getData(settings.datasource);
                if (data.length > 0) {
                    data = data[data.length - 1];
                }

                return widgetHelper.propertyByString(data, settings['dataPath']);
            }
        }, {
            key: "_createChart",
            value: function _createChart(props) {
                var data = this.getData();
                if (data == undefined) {
                    return;
                }
                var config = props.state.settings;

                this.chart = c3.generate({
                    bindto: '#chart-' + props.state.id,
                    size: {
                        height: props.state.availableHeightPx - 20
                    },
                    data: {
                        columns: [['data', data]],
                        type: 'gauge'
                    },
                    gauge: {
                        min: config['min'],
                        max: config['max'],
                        units: config['units'],
                        label: {
                            show: config['showLabel'],
                            format: function format(value, ratio) {
                                if (config['useRatio']) {
                                    return (ratio * 100).toFixed(1) + "%";
                                }
                                return value;
                            }
                        },
                        expand: false
                    },
                    color: {
                        pattern: safeParseJsonArray(config['colors']),
                        threshold: {
                            values: safeParseJsonArray(config['colorThreshold'])
                        }
                    },
                    transition: {
                        duration: 0
                    }
                });
            }
        }, {
            key: "_renderChart",
            value: function _renderChart() {
                if (!this.chart) {
                    return;
                }
                var data = this.getData();
                if (data == undefined) {
                    return;
                }

                this.chart.load({
                    columns: [['data', data]]
                });
            }
        }, {
            key: "render",
            value: function render() {
                if (this.getData() == undefined) {
                    return React.createElement(
                        "div",
                        null,
                        "No data for path: ",
                        this.props.state.settings['dataPath']
                    );
                }
                return React.createElement("div", { id: 'chart-' + this.props.state.id });
            }
        }]);

        return Widget;
    }(React.Component);

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);
})();