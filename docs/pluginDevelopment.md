# Plugin Development

The iot-dashboard is build to provide an easy and flexible API for extensions to cover custom usecases. To get started with Plugin Development you should have a understanding of the Basic Concepts, see: [Wiki Home](https://github.com/Niondir/iot-dashboard/wiki).


# Getting Started

1. Clone the git repository and follow the [Development Setup in the README.md](https://github.com/Niondir/iot-dashboard/blob/master/README.md)
2. Learn about the API below

# Dashboard Api

All Plugins are loaded as external scripts. One script must contain exactly one plugin.
All plugins in `./src/plugins` are copied to `./dist/plugins` during the build and can be loaded using relative or absolute URL's from the dashboard Plugin Dialog.

When a script is loaded by the browser it has to register the defined Plugin on the public API at `window.iotDashboardApi`

    window.iotDashboardApi = {
        registerDatasourcePlugin: (typeInfo, Datasource) => void,
        registerWidgetPlugin: (typeInfo, Widget) => void
    };

Since the plugin is loaded in global namespace it should be wrapped into a javascript module:

    (function(window) {
        // Your plugin code. Declaring variables will not pollute the global namespace.
        var TYPE_INFO = { /* Type info for the plugin*/ }
        var Plugin = function() { /* Code that defines the plugin behaviour */}

        window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Plugin)
    })(window)

The plugins should be self containing, module exports are not needed.

As you can see each plugin contains two parts. The `TYPE_INFO` and the Implementation Function `Plugin`.

## TypeInfo

The TypeInfo is mostly the same for `Datasource` and `Widget`. Additional properties for datasources or Widgets are described below.

A good start for a typeInfo would be:

    var TYPE_INFO = {
        type: "my-awesome-plugin",
        name: "My Awesome Plugin",
        description: "This plugin does awesome stuff!",
        dependencies: [],
        settings: []
    }

The full specification looks like:

    interface ITypeInfo {
        type: string // The name of the type - must be unique
        name: string // The user friendly name of the Plugin
        description: string // A user friendly description that explains the Plugin
        dependencies: string[] // A list of URL's to load external scripts from. Some scripts like jQuery will be available by default in future
        settings: ISetting[] // A list of settings that can be changed by the user when the Plugin is initialized
    }

    interface ISetting {
        id: string // Technical id, used to receive the value later
        name: string // User friendly string to describe the value
        description: string // User friendly description with detail information about the value
        defaultValue: string // The default value that is preset when a new Plugin is configured, currently must be a string
        required: boolean // true when the setting is required
        type: string // Defines how the setting is rendered, validated and interpreted
    }

Valid setting `types` are:

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


# Datasource Api

A Datasource is a JavaScript object that is responsible for fetching and caching data, so it can pass on the fetched data when `fetchData(resolve, reject)` is called.
All additional information is passed via a `props` object into the constructor.

## Props

The datasource has a props object which contains Settings and other information. Ist must not be changed by the datasource!

    export interface DatasourceProps {
        state: IDatasourceState
        setFetchInterval: (intervalInMs: number) => void // Set how often fetchData() will be called
    }

    interface IDatasourceState {
        id: string                // Technical unique id of the Widget instance
        settings: UserSettings    // Setting values from TypeInfo.settings
        data: any[]               // Array of all data values currently available to widgets
        type: string              // Id of the TypeInfo
    }

`UserSettings` is an object with one key per `Setting` in the `TypeInfo` containing the value set by the user when the Widget is created.


## Datasource implementation

The `Datasource` implementation is based on a JavaScript function

    var Datasource = function(props) {
         // Implement the constructor to setup initial state
         // The constructor is called once for every datasource instance (new Datasource(...))
         // Old data can be received at props.state.data
    }

You can define some functions to handle certain events.

    Datasource.prototype.datasourceWillReceiveProps = function (nextProps) {
          // Handle updated props
     };

     Datasource.prototype.fetchData = function (resolve, reject) {
         // Return the data that is handed over to the Widgets.
         // Data must be an array containing JavaScript objects.
         // resolve and reject are callbacks, so you can return data that is loaded async
         // Per default, resolved data is appended to the datasource data
         resolve([{value: "foo"}, {value: "bar"}]);
     }.bind(Datasource);

     Datasource.prototype.dispose = function () {
         // Cleanup state when the datasource is unloaded (e.g. stop timers)
     }.bind(Datasource)

# Widget Api

There are several ways how to render a widget.

You can set the `rendering` field in the `TypeInfo` to one of the following values:

* `"rendering": "react"` - The Widget is rendered as React component
* `"rendering": "dom"` - The Widget is rendered via DOM Manipulation, e.g. with jQuery

In both cases the same `props` object is available.

## Props

The widget has a props object which contains Settings and other information. Ist must not be changed by the widget!


    interface Props {
        state: WidgetState
        getData(datasourceId: string): any[]
    }

    interface WidgetState {
        id: string                // Technical unique id of the Widget instance
        settings: UserSettings    // Setting values from TypeInfo.settings
        row: number               // Row in the Grid
        col: number               // Column in the Grid
        height: number            // Height in the Grid
        width: number             // Width in the Grid
        availableHeightPx: number // Available height in Pixel for rendering
        type: string              // Id of the TypeInfo
    }

`UserSettings` is an object with one key per `Setting` in the `TypeInfo` containing the value set by the user when the Widget is created.

## React rendered Widget

When you define `"rendering": "react"` in your `TypeInfo` (which is the default), the Widget is rendered as React component.

This is the preferred way, since you use the same rendering framework as the rest of the Dashboard.
The component is created for each instance of the Widget.

    var Widget = React.createClass({
        render: function () {
            return React.DOM.div({}, "Hello World!");
        }
    });

The minimum you need to define a Widget is a `render()` method. The `React`-framework is avaliable in window scope.
You can define and use all lifecycle methods from react, e.g. `componentDidMount` or `componentWillReceiveProps`. See React [Component Specs and Lifecycle](https://facebook.github.io/react/docs/component-specs.html)
You can also define `Widget.propTypes` to ensure the correct properties on your `Widget`. See React [prop validation](https://facebook.github.io/react/docs/reusable-components.html#prop-validation)

## DOM rendered widgets

    var Widget = function (props) {
        // Widget constructor function. Created with new Widget(props).
    }

    // Define render() function
    Widget.prototype.render = function (props, element) {
        html = "<div>Hello Workd!</div>";
        element.innerHTML = html;
    }.bind(Widget)

The minimum you need to define a Widget is constructor function and a `render(props, element)` method.
The render method gets the props (same as the props when rendered as React component) and the element to render the content.

For rendering you can use the Browser DOM api or jQuery (`$` and `jQuery`) which available in window scope.

Since the Widget is wrapped into a React component internally, all React lifecycle methods are available as well. See React [Component Specs and Lifecycle](https://facebook.github.io/react/docs/component-specs.html)

# Testing of Plugins

It is planned to offer specialized infrastructure to test Plugins in future.
