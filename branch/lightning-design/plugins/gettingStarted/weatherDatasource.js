'use strict';

(function (window) {

    var TYPE_INFO = {
        type: 'simpleweatherjs-ds',
        name: 'Weather',
        description: 'Receive Weather data from Yahoo!',
        dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/jquery.simpleWeather/3.1.0/jquery.simpleWeather.min.js'],
        settings: [{
            id: 'unitType',
            name: 'Units',
            type: 'option',
            defaultValue: 'metric',
            options: [{ name: 'Metric', value: 'metric' }, { name: 'Imperial', value: 'imperial' }]
        }, {
            id: 'location',
            name: "Location",
            type: 'string',
            description: 'lat/lon, US zip code, or location name for Yahoo! weather API',
            defaultValue: 'Austin, TX'
        }]
    };

    var Plugin = function Plugin(props) {};

    Plugin.prototype.fetchData = function (fulfill, reject) {
        var settings = this.props.state.settings;
        $.simpleWeather({
            location: settings["location"],
            woeid: '',
            unit: settings["unitType"] === 'metric' ? 'c' : 'f',
            success: function success(weather) {
                fulfill([weather]);
            },
            error: function error(_error) {
                reject(_error);
            }
        });
    };

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Plugin);
})(window);