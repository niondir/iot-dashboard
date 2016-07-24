(function (window) {

    var TYPE_INFO = {
        type: 'simpleweatherjs',
        name: 'Weather',
        description: 'Receive Weatherdata from Yahoo!',
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

    var Plugin = function (props) {
        this.history = props.state.data;

        this.setupFetchData = function (props) {
            var settings = props.state.settings;

            if (this.timer) {
                clearInterval(this.timer);
            }
            return setInterval(function () {
                console.log("Fetching weather data");
                $.simpleWeather({
                    location: settings["location"],
                    woeid: '',
                    units: getUnits(settings["unitType"]),
                    success: function (weather) {
                        this.history.push(weather);
                        this.history = limitHistory(this.history, 100);
                    }.bind(this),
                    error: function (weather) {
                    }.bind(this)
                })
            }.bind(this), 5000);
        }.bind(this);

        this.timer = this.setupFetchData(props);
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

    Plugin.prototype.getValues = function () {
        return this.history;
    };

    Plugin.prototype.dispose = function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
    };


    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Plugin)
})(window);