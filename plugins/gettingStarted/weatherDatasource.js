(function (window) {

    const TYPE_INFO = {
        type: 'simpleweatherjs',
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
            units: getUnits(settings["unitType"]),
            success: function (weather) {
                fulfill([weather]);
            },
            error: function (error) {
                reject(error);
            }
        })
    };

    function getUnits(type) {
        switch (type) {
            case 'metric':
                return {temp: 'c', distance: 'km', pressure: 'mb', speed: 'kph'};
            default:
                return {temp: 'f', distance: 'mi', pressure: 'in', speed: 'mph'};
        }
    }

    function limitHistory(history, count) {
        return history.slice(history.length - count);
    }

    Plugin.prototype.datasourceWillReceiveProps = function (nextProps) {
        if (this.props.state.settings !== nextProps.state.settings) {
            this.timer = this.setupFetchData(nextProps);
        }
    };

    Plugin.prototype.dispose = function () {
    };


    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Plugin)
})(window);