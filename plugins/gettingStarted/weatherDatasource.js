(function (window) {

    const TYPE_INFO = {
        type: 'simpleweatherjs-ds',
        name: 'Weather',
        description: 'Receive Weather data from Yahoo!',
        dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/jquery.simpleWeather/3.1.0/jquery.simpleWeather.min.js'],
        settings: [
            {
                id: 'unitType',
                name: 'Units',
                type: 'option',
                defaultValue: 'metric',
                options: [
                    {name: 'Metric', value: 'metric'},
                    {name: 'Imperial', value: 'imperial'}
                ]
            },
            {
                id: 'location',
                name: "Location",
                type: 'string',
                description: 'lat/lon, US zip code, or location name for Yahoo! weather API',
                defaultValue: 'Austin, TX'
            }
        ]
    };

    const Plugin = function (props) {
    };

    Plugin.prototype.fetchData = function(fulfill, reject) {
        const settings = this.props.state.settings;
        $.simpleWeather({
            location: settings["location"],
            woeid: '',
            unit: settings["unitType"] === 'metric' ? 'c' : 'f',
            success: function (weather) {
                fulfill([weather]);
            },
            error: function (error) {
                reject(error);
            }
        })
    };

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Plugin)
})(window);