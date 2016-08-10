# iot-dashboard Documentation

**Content:**

* [Hosting the iot-dashboard](#hosting-the-iot-dashboard)
* [Contributing](#Contributing) to the dashboard core codebase (this git repo)
* [Basic Concepts & Architecture](#basic-concepts-&-architecture)
* [Coding Guidelines](#coding-guidelines)
* [Plugin Development](pluginDevelopment.md)
* [Security](security.md) related topics

# Hosting the iot-Dashboard
If you plan to host an own instance of the iot-dashboard please have a look into our [Security](Security) page. A documentation on how to setup your own instance on a server might follow in future and will require some additional work on the Dashboard before.

# Contributing
All contributions to the core and plugins are very welcome.

To get started with writing code for the Dashboard core you need a good understanding of the Basic Concepts (see below) and follow the Coding Guidelines (see blow).
If you want to provide another datasource or visualization in form of a new widget checkout the [Plugin Development](pluginDevelopment.md) page.

# Basic Concepts & Architecture
A basic overview of the concepts and ideas behind the Dashboard.

Not all Concepts are implemented yet. Not implemented concepts might change in future.

* **Dashboard:** A `Dashboard` defines `Datasources`, `Widgets` and `Layouts` and can be imported and exported.
* **Layout:** A `Layout` belongs to one `Dashboard` and defines how `Widgets` are arranged.
* **Widget:** A `Widget` can be arranged inside the `Layout` and renders content based on the `WidgetType`, `WidgetProps` and `Datasources`.
    * There are several predefined, more and less generic `Widgets` that can be configured and saved as `Widget Blueprints`.
* **Widget Blueprints:** A `Dashboard` can define `Widget Blueprints` which provides an easy way to compose complex layouts with less widget configuration effort.
* **Plugins:** Plugins provide the implementations for `Datasources` and `Widgets`.
* **Datasource:** A `Datasource` provides data for `Widgets` on request.
* **Datasource Type:** A `Datasource Type` defines how a `Datasource` can fetch data,
    * e.g. a simple REST datasource, or a more sophisticated for specific services like dweet.io, google docs, etc.

## Datasources

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

# Coding Guidelines

Eslint and tslint is in place and must be followed to get successful CI builds.

New code must be tested, unittests can be provided next to the code folder as `<filename>.test.ts`, they will be executed automatically during build.
Read the redux guide about [writing tests](http://redux.js.org/docs/recipes/WritingTests.html).


## Folder Structure

* Folders should reflect the business domain not Framework structures
* `root` - Globally used stuff & new stuff that can not be sorted in yet
* `ui` - generic, reusable UI components
* `util` - generic, reusable functions that helps in certain situations
* `typings` - contains custom typings in case the ones managed by the `typings.json` are not sufficient
* *Everything else* - should match to the Basic Concepts (see ab ove)

## File Naming

* `.js` / `.ts` - Business Logic: Actions & Reducers
* `.ui.js` / `.tsx` - React components
* `.test.js` / `.test.ts` - Tests, automatically loaded by gulp inject

# Webpack Analysis

Useful to check problems in the Webpack build.

- Execute: `npm run webpack-profile`
- Goto: [https://webpack.github.io/analyse/](https://webpack.github.io/analyse/)
- Load the generated stats.json
