'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// We wrap the code into an anonymous function that is executed immediately to not pollute the global namespace.
// More about JavaScript Module pattern: http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
(function () {

    // First define a JavaScript object with metadata for the plugin.
    // The object must be serializable, i.e. there must not be any function definitions inside
    var TYPE_INFO = {
        // The type is the primary key of the plugin an must be globally unique
        type: 'simpleweatherjs-ds',
        // The name is displayed to the user to name the Plugin
        name: 'Weather',
        // The kind is 'datasource' or 'widget' and used internally
        kind: 'datasource',
        // Take some credits in the author field
        author: 'Lobaro',
        // Use semantic version to version your plugins, it helps to keep track of changes
        version: '1.0.0',
        // A Description is shown in the UI to explain what the plugin does
        description: 'Receive Weather data from Yahoo!',
        // JavaScript and CSS dependencies can be loaded here
        // We do not load jQuery here because it's provided by the Dashboard - This will change in future!
        dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/jquery.simpleWeather/3.1.0/jquery.simpleWeather.min.js'],
        // The settings array describes the options shown in the config dialog of the plugin
        settings: [{
            // The id is unique for each plugin and is used to reference the setting value in code
            id: 'unitType',
            // The name is displayed next to the field
            name: 'Units',
            // There are several types, here we let the user choose one of multiple options from a drop down box
            type: 'option',
            // The default value is referencing the 'value' that is selected by default
            defaultValue: 'metric',
            options: [
            // Each option can have a name and a value, where the name is displayed to the user and the value is used in code
            { name: 'Metric', value: 'metric' }, { name: 'Imperial', value: 'imperial' }]
        }, {
            id: 'location',
            name: "Location",
            // The string type just renders a string input field
            type: 'string',
            // The description is optional and shows a little hint icon with details about the setting
            description: 'lat/lon, US zip code, or location name for Yahoo! weather API',
            defaultValue: 'Austin, TX'
        }]
    };

    // Plugins are compiled with Babel
    // This means we can use ES6 JavaScript features like classes and do not have to care about older browsers. Babel will make it work!

    var Plugin = function () {
        function Plugin() {
            _classCallCheck(this, Plugin);
        }

        _createClass(Plugin, [{
            key: 'constrctor',
            value: function constrctor(props) {
                // Any code that is required to execute when the plugin is loaded the first time e.g. setting up some properties
                // Set how often fetchData() will be called, 'Infinite' to disable regular updates
                props.setFetchInterval(10 * 1000); // Fetch every 10 seconds, and once after the plugin is loaded.
                props.setFetchReplaceData(true);
            }

            // The only required function

        }, {
            key: 'fetchData',
            value: function fetchData(fulfill, reject) {
                // Return data via the fulfill callback, that should be rendered by Widgets
                // Data must be an 'array' containing 'objects', e.g. [{temp: 23.5}, {temp: 23.3}]
                // resolve and reject are callbacks, to allow returning data from async callbacks
                // Per default, resolved data is appended to the datasource (see props.setFetchReplaceData above)
                // fetchData() is called when the datasource is created, after settings changed and regularly depending on the value of setFetchInterval(intervalInMs: number)

                // We can always access the datasource properties we saw in the constructor via this.props
                // Via the state we can access the setting values set by the user
                var settingValues = this.props.state.settings;
                // Call the simpleWeather jQuery plugin according to the documentation
                $.simpleWeather({
                    // The "location" property of settingValues holds the value of the setting with the id "location"
                    location: settingValues["location"],
                    woeid: '',
                    unit: settingValues["unitType"] === 'metric' ? 'c' : 'f',
                    success: function success(weather) {
                        // On success we call our fulfill callback and handover the data
                        fulfill([weather]);
                    },
                    error: function error(_error) {
                        // On error we tell the dashboard not to wait for data any longer
                        // Else the dashboard would wait for timeout and print an error to the console
                        reject(_error);
                    }
                });
            }
        }]);

        return Plugin;
    }();

    // Now we just have to handover our TYPE_INFO object and Plugin class to the dashboard API to load them


    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Plugin);
})();