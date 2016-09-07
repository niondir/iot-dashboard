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
        type: "chart",
        name: "Chart",
        description: "Renders a chart. Will be way more flexible in future.",
        settings: [{
            id: 'datasource',
            name: 'Datasource',
            type: 'datasource'
        }, {
            id: 'chartType',
            name: 'Chart Type',
            type: 'option',
            defaultValue: 'spline',
            options: ['line', 'spline', 'step', 'area', 'area-spline', 'area-step', 'bar', 'scatter', 'pie', 'donut', 'gauge']
        }, {
            id: 'dataKeys',
            type: "json",
            name: "Data Keys",
            description: "An array of Keys of an data object that define the data sets",
            defaultValue: '["value"]'
        }, {
            id: 'xKey',
            type: "string",
            name: "X Key",
            description: "Key of an data object that defines the X value",
            defaultValue: "x"
        }, {
            id: 'names',
            type: "json",
            name: "Data Names",
            description: "Json object that maps Data Keys to displayed names",
            defaultValue: '{"value": "My Value"}'
        }, {
            id: 'gaugeData',
            type: "json",
            name: "Gauge Data",
            description: "Json object that is passed as configuration for gauge chats",
            defaultValue: JSON.stringify({ "min": 0, "max": 100, units: ' %' })
        } /*,
          {
          id: 'donutData',
          type: "json",
          name: "Gauge Data",
          description: "Json object that maps Data Keys to displayed names",
          defaultValue: JSON.stringify({title: 'Title'})
          }*/
        ]
    };

    function safeParseJsonObject(string) {
        try {
            return JSON.parse(string);
        } catch (e) {
            console.error("Was not able to parse JSON: " + string);
            return {};
        }
    }

    function safeParseJsonArray(string) {
        try {
            return JSON.parse(string);
        } catch (e) {
            console.error("Was not able to parse JSON: " + string);
            return {};
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
                if (nextProps.settings !== this.settings || nextProps.state.height !== this.props.state.height) {
                    this._createChart(nextProps);
                }
            }
        }, {
            key: "_createChart",
            value: function _createChart(props) {
                var config = props.state.settings;
                var data = props.getData(config.datasource);
                this.chart = c3.generate({
                    bindto: '#chart-' + props.state.id,
                    size: {
                        height: props.state.availableHeightPx
                    },
                    data: {
                        json: data,
                        type: config.chartType,
                        // Seems not to work with chart.load, so on update props we have to recreate the chart to update
                        names: safeParseJsonObject(config.names),
                        keys: {
                            x: config.xKey ? config.xKey : undefined,
                            value: safeParseJsonArray(config.dataKeys)
                        }
                    },
                    axis: {
                        x: {
                            tick: {
                                culling: false
                            }
                        }
                    },
                    gauge: safeParseJsonObject(config.gaugeData),
                    donut: {
                        label: {
                            show: false
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
                var props = this.props;
                var settings = props.state.settings;
                var data = props.getData(settings.datasource);

                // TODO: Do not take last element, but all new elements ;)
                var lastElement = data.length > 0 ? data[data.length - 1] : {};

                /* chart.flow does not work with x axis categories and messes up the x values.
                 this.chart.flow({
                 json: [lastElement],
                 keys: {
                 //x: "x",//config.xKey || undefined,
                 value: safeParseJsonObject(config.dataKeys)
                 },
                 labels: false,
                 //to: firstElement[config.xKey],
                 duration: 500
                 });     */

                this.chart.load({
                    json: data,
                    keys: {
                        x: settings.xKey || undefined,
                        value: safeParseJsonObject(settings.dataKeys)
                    },
                    labels: false
                });
            }
        }, {
            key: "render",
            value: function render() {
                this._renderChart();
                return React.createElement(
                    "div",
                    { style: { padding: "10px" } },
                    React.createElement("div", { className: "", id: 'chart-' + this.props.state.id })
                );
            }
        }, {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                console.log("Unmounted Chart Widget");
            }
        }, {
            key: "dispose",
            value: function dispose() {
                console.log("Disposed Chart Widget");
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