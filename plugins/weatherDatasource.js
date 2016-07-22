(function (window) {

    var TYPE_INFO = {
        type: 'simpleweatherjs',
        name: 'Weather',
        description: 'Receive Weatherdata from Yahoo!',
        dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/jquery.simpleWeather/3.1.0/jquery.simpleWeather.min.js'],
        settings: [
            {
                id: 'unitType',
                type: 'option',
                defaultValue: 'metric',
                options: [
                    {name: 'Metric', value: 'metric'},
                    {name: 'Imperial', value: 'imperial'}
                ]
            },
            {
                id: 'location',
                type: 'string',
                description: 'lat/lon, US zip code, or location name for Yahoo! weather API',
                defaultValue: 'Austin, TX'
            }
        ]
    };

    var Plugin = function (props) {
        this.history = props.state.data;
        this.timer = setupFetchData(props).bind(this);
    };

    function setupFetchData(props) {
        var settings = props.state.settings;

        if (this.timer) {
            clearInterval(this.timer);
        }

        return setInterval(function () {
            $.simpleWeather({
                location: settings["location"],
                woeid: '',
                units: getUnits(settings["unitType"]),
                success: function (weather) {
                    this.history.push(weather)
                }.bind(this),
                error: function (weather) {
                }.bind(this)
            })
        }, 10000);
    }

    function getUnits(type) {
        switch (type) {
            case 'metric':
                return {temp: 'c', distance: 'km', pressure: 'mb', speed: 'kph'}
            default:
                return {temp: 'f', distance: 'mi', pressure: 'in', speed: 'mph'}
        }
    }

    function limitHistory(history, count) {
        return history.slice(Math.max(history.length - count, 1))
    }

    Plugin.prototype.datasourceWillReceiveProps = function (nextProps) {
        this.timer = setupFetchData(nextProps).bind(this);
    }.bind(this);

    Plugin.prototype.getValues = function () {
        this.history = limitHistory(this.history, 100);
        return this.history;
    }.bind(Plugin);

    Plugin.prototype.dispose = function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }.bind(Plugin);

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Plugin)
})(window);