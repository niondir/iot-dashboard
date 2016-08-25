'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (window) {

    var TYPE_INFO = {
        type: 'simpleweatherjs-widget',
        name: 'Weather',
        description: 'Visualize Weather data',
        settings: [{
            id: 'datasource',
            name: 'Datasource',
            type: 'datasource',
            description: "Datasource to get the weather data"
        }]
    };

    var Plugin = function (_React$Component) {
        _inherits(Plugin, _React$Component);

        function Plugin() {
            _classCallCheck(this, Plugin);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(Plugin).apply(this, arguments));
        }

        _createClass(Plugin, [{
            key: 'render',
            value: function render() {
                var props = this.props;
                var settings = props.state.settings;

                var allData = props.getData(settings.datasource);

                if (allData.length === 0) {
                    return React.createElement(
                        'div',
                        null,
                        'No Data ',
                        JSON.stringify(data)
                    );
                }

                var data = allData[allData.length - 1];
                var units = data.units || {};

                return React.createElement(
                    'div',
                    { style: { padding: 5 } },
                    React.createElement(
                        'h1',
                        null,
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
                        React.createElement('img', { className: 'ui left floated small image', src: data.image }),
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