'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The structure of a Widget plugin is very similar to a DataSource
// Please see the comments at the weather datasource if you miss something here.
(function (window) {

    var TYPE_INFO = {
        type: 'simpleweatherjs-widget',
        name: 'Weather',
        kind: 'widget',
        author: 'Lobaro',
        version: '1.0.0',
        description: 'Visualize Weather data',
        settings: [{
            id: 'datasource-setting',
            name: 'Datasource',
            // datasource is a special type that let the user select a datasource
            // The widget will only have access to data from assigned datasources
            // If you need more than one datasource, you can specify multiple settings
            type: 'datasource',
            description: "Datasource to get the weather data"
        }]
    };

    // A Widget is based on a ReactJS Component
    // React is available to all plugins and must not be declared as dependency

    var Plugin = function (_React$Component) {
        _inherits(Plugin, _React$Component);

        function Plugin() {
            _classCallCheck(this, Plugin);

            return _possibleConstructorReturn(this, (Plugin.__proto__ || Object.getPrototypeOf(Plugin)).apply(this, arguments));
        }

        _createClass(Plugin, [{
            key: 'render',

            // Beside all optional lifecycle methods of React you must specify a render method
            // Render is called when ever settings change or a
            value: function render() {
                // Like in the datasource we can access props via 'this.props'
                var props = this.props;
                // And the settings are saved in the same location as for datasources
                var settingValues = props.state.settings;

                // The getData() function returns data from the datasource, just hand over the selected datasource from the settings
                // The dashboard will always return an array of object
                var allData = props.getData(settingValues['datasource-setting']);

                // When there is no data, we let the user know by rendering a static text
                if (allData.length === 0) {
                    // We can use 'jsx' syntax here. Babel will compile the <div> to:
                    // return React.createElement('div', null, 'No Data');
                    return React.createElement(
                        'div',
                        null,
                        'No Data'
                    );
                }

                // Since we just want to show the last fetched value from the datasource we take the last element
                var data = allData[allData.length - 1];
                var units = data.units || {};

                return React.createElement(
                    'div',
                    { style: { padding: 5 } },
                    React.createElement(
                        'h1',
                        { style: { marginTop: 0 } },
                        data.city,
                        ', ',
                        data.country
                    ),
                    React.createElement(
                        'p',
                        null,
                        data.updated
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement('img', { className: '', style: { float: 'left' }, src: data.image }),
                        React.createElement(
                            'span',
                            null,
                            'Temp: ',
                            data.temp,
                            ' ',
                            units.temp,
                            React.createElement('br', null),
                            'Humidity: ',
                            data.humidity,
                            ' %',
                            React.createElement('br', null),
                            'Pressure: ',
                            data.pressure,
                            ' ',
                            units.pressure
                        )
                    )
                );
            }
        }]);

        return Plugin;
    }(React.Component);

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Plugin);
})(window);