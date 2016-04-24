**Master:**  No Tests Yet  
**Dev:** [![Build Status](https://travis-ci.org/Niondir/iot-dashboard.svg?branch=dev)](https://travis-ci.org/Niondir/iot-dashboard)  

# Individual Open Technology - Dashboard
Free Dashboard for your Data

A generic dashboard application based on JavaScript, HTML and CSS that runs in modern browsers.
Allows to arrange and configure widgets.
A Plugin API will allow easy widget and custom datasource development to keep the dashboard as extensible as possible.

**Not Done Yet** 
This Project is still in Development and can not be used. Subscribe to get updates.

The **latest stable version** is on the `master` branch.
The **latest development snapshot** is on the `dev` branch.

## Demo ##

 [Live Demo Stable](http://demo.iot-dashboard.org/) of the `master` branch.  
 [Live Demo Dev](http://demo.iot-dashboard.org/branch/dev/) of the `dev` branch.

## Setup ##

We have just a development setup yet, since there is no need for more :)

### Development ###

Run the Webpack Server with livereload and hot module replacement with:

    gulp dev
  
Run a second watch task to keep some other files up to date with:

    gulp watch

To generate some deployable code in dist execute:

    gulp compile

#### Webpack Analysis ####

Useful to check problems in the Webpack build.

- Execute: `webpack --profile --json > stats.json`
- Goto: https://webpack.github.io/analyse/
- Load the generated stats.json

## License ##
I have not applied any OpenSource license yet.  
In case you want to use or modify the code or parts of it outside of GitHub, **you have to ask for permissions**.  
Feel free to fork or modify the code on GitHub or distribute it in any non-commercial way. Contributions are very welcome.

The code will most likely be available under [MPL](https://www.mozilla.org/en-US/MPL/) in future.

## Documentation ##

### Basic Concepts ###
A basic overview of the concepts and ideas behin the Dashboard.

Not all Concepts are implemented yet. Not implemented concepts might change in future.

**Dashboard:** A `Dashboard` defines `Datasources`, `Widgets` and `Layouts` and can be imported and exported  
**Layout:** A `Layout` belongs to one `Dashboard` and defines how `Widgets` are arranged  
**Widget:** A `Widget` can be arranged inside the `Layout` and renders content based on the `WidgetType`, `WidgetProps` and `Datasources`.
There are several predefined, more and less generic `Widgets` that can be configured and saved as `Widget Blueprints`.  
**Widget Blueprints:** A `Dashboard` can define `Widget Blueprints` which provides an easy way to compose complex layouts with less widget configuration effort.  
**Plugins:** Plugins provide the implementations for `Datasources` and `Widgets`  
**Datasource:** A `Datasource` provides data for `Widgets` on request.  
**Datasource Type:** A `Datasource Type` defines how a `Datasource` can fetch data, 
e.g. a simple REST datasource, or a more sophisticated for specific services like dweet.io, google docs, etc.

#### Datasources ####

* **DatasourcePlugin:** Can be written by anybody to provide logic that fetches data from anywhere
* **DatasourceInstance:** Can be created by the user based on any `DatasourcePlugin`. Executes the actual data fetching.
* **DatasourceState:** Contains properties defined by the user when a `DatasourceInstance` is created  
 and is updated regularly with data from the `DatasourceInstance`
* **DatasourceWorker:** Managing the actual updating of the `DatasourceState` based on the `DatasourceInstance` and the current `DatasourceState`

The following needs way more documentation in future, just a quick start:

A `DatasourcePlugin` can provide 2 functions:
* `fetchNewValues(): [{value}]`
* `fetchPastValues(since): [{value}]`
  * Implementation is optional
* `Value` can be any kind of JSON object. 
    * Widgets can verify if they are able to display given values
    
And a `TYPE_INFO` constant.

## Coding guidelines ##

### Folder Structure ###

* Folders should reflect the business domain not Framework structures 
* `root` - Globally used stuff & new stuff that can not be sorted in yet
* `ui` - generic, reusable UI components
* `util` - generic, reusable functions that helps in certain situations
* *Everything else* - should match to the Basic Concepts (see above)

### File Naming ###

* `.js` - Business Logic: Actions & Reducers
* `.ui.js` - React components
* `.test.js` - Tests, automatically loaded by gulp inject


