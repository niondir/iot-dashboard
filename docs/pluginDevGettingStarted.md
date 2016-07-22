# Plugin Development Getting Started

Lets get started and setup the Dashboard and get the first Plugins running in 20 minutes.

## Step 1: Setup your dev environment

**Prerequisites:**
* Install git, e.g. from [git-scm.com](https://git-scm.com/)
* Install nodejs, e.g. from [nodejs.org](https://nodejs.org/en/)

    git clone https://github.com/Niondir/iot-dashboard.git
    cd iot-dashboard/
    npm install
    npm run dev

That's it, you can modify code and see the result (dashboard and tests) in the browser.

* Dashboard: http://localhost:8081/
* Tests: http://localhost:8080/webpack-dev-server/tests.html

Plugins are loaded at runtime and not bundled with the Dashboard, that's why the webpack dev server does not load them.
Just start another task that helps you with that:

    npm run watch

## Step 2: Create your own datasource

You probably want to fetch data from somewhere to render it in the Dashboard.

Data is fetched from the browser of who ever is opening the dashboard. The best way to get data in a web application is to do some http requests but you could also go for some websockets. There are not limitations.

For api's that need an API key, e.g. the Twitter API it's best practice to fetch data for your Dashboard on a server, cache it and connect a Datasource to that server. We do not want to cover Serverside stuff here, so let's go for some free data. How about [weather](http://simpleweatherjs.com/)?

Lets build our Datasource plugin!

First create a new file `plugins/weatherDatasource.js`
And add some code:

    Code HERE

Now open the Dashboard in your browser and go to `Plugins` -> Load from URL: `plugins/weatherDatasource.js` -> `Load Plugin`

You should now see the plugin in the list of Datasource Plugins.
`Close` the dialog and add a new Datasource (`Datasources` -> `Add Datasource`). Select your plugin (`Weather`) and fill the settings.

To see the data add a text Widget (`Add Widget` -> `Text`) and select your datasource. Now you see what you datasource provides to the widget.
