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

 [Live Demo](https://niondir.github.io/iot-dashboard/) of the `last-stable` version.

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

Usefull to check problems in the Webpack build.

- Execute: `webpack --profile --json > stats.json`
- Goto: https://webpack.github.io/analyse/
- Load the generated stats.json


## Documentation ##

### Basic Concepts ###
A basic overview of the concepts and ideas behin the Dashboard.

Not all Concepts are implemented yet. Not implemented concepts might change in future.

**Dashboard:** A `Dashboard` defines `Data Sources`, `Widgets` and `Layouts`  
**Layout:** A `Layout` belongs to one `Dashboard` and defines how `Widgets` are arranged  
**Widget:** A `Widget` can be arranged inside the `Layout` and renders content based on the `WidgetType`, `WidgetProps` and `Data Sources`.
There are several predefined, more and less generic `Widgets` that can be configured and saved as `Widget Blueprints`.  
**Widget Blueprints:** A `Dashboard` can define `Widget Blueprints` which provides an easy way to compose complex layouts with less widget configuration effort.  
**Plugins:** Plugins provide the implementations for `Data Sources` and `Widgets`  
**Data Sources:** A `Data Source` provides data for `Widgets` on request.  
**Data Source Type:** A `Data Source Type` defines how a `Data Source` can fetch data, 
e.g. a simple REST datasource, or a more sophisticated for specific services like dweet.io, google docs, etc.

* A Datasource provides 2 function:
    * `fetchNewValues(): [{value}]`
    * `fetchPastValues(since): [{value}]`
      * Implementation is optional
    * `Value` can be any kind of JSON object. 
        * Widgets can verify if they are able to display given values
