'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The structure of a Widget plugin is very similar to a DataSource
// Please see the comments at the weather datasource if you miss something here.
(function (window) {

    var TYPE_INFO = {
        type: 'google-guage',
        name: 'Meter',
        kind: 'widget',
        author: 'Lobaro',
        version: '1.0.0',
        description: 'Visualize data in form of meter',
        dependencies: ['https://www.gstatic.com/charts/loader.js'],
        settings: [{
            id: 'datasource-setting',
            name: 'Datasource',
            // datasource is a special type that let the user select a datasource
            // The widget will only have access to data from assigned datasources
            // If you need more than one datasource, you can specify multiple settings
            type: 'datasource',
            description: "Datasource to get the weather data"
        }, {
            id: 'dataPath',
            type: "string",
            name: "Data Path",
            description: "The path to get the data from the last data source value, e.g. nested.array[4] - do not use quoted between []",
            defaultValue: ''
        }, {
            id: 'min',
            name: 'Minimum value showing in scale',
            type: 'number',
            defaultValue: '0'
        }, {
            id: 'max',
            name: 'Maximum value showing in scale',
            type: 'number',
            defaultValue: '200'
        }, {
            id: 'redFrom',
            name: 'Red label starting at value:',
            type: 'number',
            defaultValue: '1'
        }, {
            id: 'redTo',
            name: 'Red label ending at value:',
            type: 'number',
            defaultValue: '10'
        }, {
            id: 'yellowFrom',
            name: 'Yellow label starting at value:',
            type: 'number',
            defaultValue: '10'
        }, {
            id: 'yellowTo',
            name: 'Yellow label ending at value:',
            type: 'number',
            defaultValue: '40'
        }, {
            id: 'Title',
            name: 'Title',
            type: 'text',
            defaultValue: 'Title'
        }]
    };

    // A Widget is based on a ReactJS Component
    // React is available to all plugins and must not be declared as dependency

    var Plugin = function (_React$Component) {
        _inherits(Plugin, _React$Component);

        // Beside all optional lifecycle methods of React you must specify a render method
        // Render is called when ever settings change or a
        function Plugin(props) {
            _classCallCheck(this, Plugin);

            var _this = _possibleConstructorReturn(this, (Plugin.__proto__ || Object.getPrototypeOf(Plugin)).call(this, props));

            _this.state = {
                data1: undefined,
                options1: {},
                chart: {}
            };
            return _this;
        }

        _createClass(Plugin, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                var props = this.props;
                var settingValues = props.state.settings;

                google.charts.load('current', { 'packages': ['gauge'] });

                var data1 = void 0,
                    options1 = void 0,
                    chart = void 0;

                google.charts.setOnLoadCallback(function () {

                    data1 = google.visualization.arrayToDataTable([['Label', 'Value'], [settingValues.Title, 0]]);

                    _this2.setState({
                        data1: data1
                    });

                    options1 = {
                        height: props.state.availableHeightPx,
                        //height: this.props.state.availableClientHeight,
                        redFrom: settingValues.redFrom, redTo: settingValues.redTo,
                        min: settingValues.min, max: settingValues.max,
                        yellowFrom: settingValues.yellowFrom, yellowTo: settingValues.yellowTo,
                        minorTicks: 5
                    };

                    _this2.setState({
                        options1: options1
                    });

                    chart = new google.visualization.Gauge(document.getElementById('chart_div'));

                    _this2.setState({
                        chart: chart
                    });

                    _this2.initialized = true;
                });
            }
        }, {
            key: 'render',
            value: function render() {
                // Like in the datasource we can access props via 'this.props'
                var props = this.props;
                // And the settings are saved in the same location as for datasources
                var settingValues = props.state.settings;

                // The getData() function returns data from the datasource, just hand over the selected datasource from the settings
                // The dashboard will always return an array of object
                var allData = props.getData(settingValues['datasource-setting']);

                // Since we just want to show the last fetched value from the datasource we take the last element
                var data = void 0;
                if (allData.length > 0) {
                    data = allData[allData.length - 1];
                }
                //const units = data.units || {};

                // When there is no data, we let the user know by rendering a static text
                if (allData.length === 0) {
                    // We can use 'jsx' syntax here. Babel will compile the <div> to:
                    // return React.createElement('div', null, 'No Data');
                    return React.createElement(
                        'div',
                        { id: 'chart_div' },
                        'No Data'
                    );
                }
                if (this.initialized) {
                    this.state.data1.setValue(0, 1, window.widgetHelper.propertyByString(data, settingValues['dataPath']));
                    this.state.chart.draw(this.state.data1, this.state.options1);
                }

                return React.createElement('div', { id: 'chart_div' });
            }
        }]);

        return Plugin;
    }(React.Component);

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Plugin);
})(window);