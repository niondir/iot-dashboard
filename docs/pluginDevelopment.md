# Plugin Development

The iot-dashboard is build to provide an easy and flexible API for extensions to cover custom usecases. To get started with Plugin Development you should have a understanding of the Basic Concepts, see: [Wiki Home](https://github.com/Niondir/iot-dashboard/wiki).


# Getting Started
1. Checkout the code and follow the [Development Setup in the README.md](https://github.com/Niondir/iot-dashboard/blob/master/README.md)
2. Learn about the API below
3. Checkout the technical API's:

  * [Datasource API](datasourceApi.md)
  * [Widget API](widgetApi.md)

# Dashboard API

All Plugins are loaded as external scripts. One script must contain exactly one plugin.
When a script is loaded by the browser it has to register the defined Plugin on the public API at `window.iotDashboardApi`

    window.iotDashboardApi = {
        registerDatasourcePlugin: (typeInfo, Datasource) => void,
        registerWidgetPlugin: (typeInfo, Widget) => void
    };

Since the plugin is loaded in global namespace it should be wrapped into a javascript module:

    (function(window) {
        // Your plugin code. Declaring variables will not pullute the global namespace.
        var TYPE_INFO = { /* Type info for the plugin*/ }
        var Datsource = function() { /* Code that defines the datasource behaviour */}

        window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource)
    })(window)

Since the plugins should be self containing, exports are not required.

As you can see each plugin contains two parts. The `TypeInfo` and the `Implementation Function`.

## TypeInfo

The TypeInfo is mostly the same for `Datasource` and `Widget`

    interface TypeInfo {
        type: string // The name of the type - must be unique
        name: string // The user friendly name of the Plugin
        description: string // A userfirnedly descripton that explains the Plugin
        settings: Setting[] // A list of settings that can be changed by the user when the Plugin is initialized
    }


    interface Setting {
    {
       id: string // Technical id, used to retreive the value later
       name: string // User friendly string to describe the value
       description: string // User friendly desctiption with detail information about the value
       defaultValue: string // The default value that is preset when a new Plugin is configured, curently must be a string
       required: true // true when the setting is required
       type: string // Defines how the setting is rendered, validated and interpreted
    }

Valid setting types are:

* `string` - Single line text value
* `text` - Multiline text value
* `boolean` - Boolean value, rendered as checkbox
* `number` - A number value rendered as number field. You can add additional fields to the `Setting`
    * `min` - The minimal value
    * `max` - The maximal value
* `datasource` - Renders a list of datasources as single select
* `json` - A text value that is interpreted as json (not much support yet)
* `option` - A single select control. You can add additional fields to the `Setting`
    * `options` - Array of option values. Each option value can be a `String` or object like `{name: "name", value: "value"}`. DefaultValue must reference the value.

There is still some work left for settings. There is no validation yet, values are not converted to the correct javascript type, etc. The settings api might slightly change in future..
