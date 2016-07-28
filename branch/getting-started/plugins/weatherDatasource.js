(function (window) {

    var TYPE_INFO = {
        type: 'simpleweatherjs',
        name: 'Weather',
        description: 'Receive Weatherdata from Yahoo!',
        dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/jquery.simpleWeather/3.1.0/jquery.simpleWeather.min.js'],
        fetchData: {
            interval: 10000
        },
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

    var Plugin = function (props) {
    };

    function fetchData(fulfill, reject) {
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
    }

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