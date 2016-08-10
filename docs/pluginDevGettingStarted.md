# Plugin Development Getting Started

Lets get started and setup the Dashboard and get the first Plugins running in under 15 minutes.

## Step 1: Setup your dev environment

**Prerequisites:**
* Install git, e.g. from [git-scm.com](https://git-scm.com/)
* Install nodejs, e.g. from [nodejs.org](https://nodejs.org/en/)

    git clone https://github.com/Niondir/iot-dashboard.git
    cd iot-dashboard/
    npm install
    npm run dev

That's it, you can modify code and see the result (dashboard and tests) in the browser.

* Dashboard: [http://localhost:8081](http://localhost:8081/)
* Tests: [http://localhost:8080/webpack-dev-server/tests.html](http://localhost:8080/webpack-dev-server/tests.html)

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

    (function (window) {

        const TYPE_INFO = {
            type: 'simpleweatherjs-ds',
            name: 'Weather',
            description: 'Receive Weather data from Yahoo!',
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

        const Plugin = function (props) {
        };

        Plugin.prototype.fetchData = function(fulfill, reject) {
            const settings = this.props.state.settings;
            $.simpleWeather({
                location: settings["location"],
                woeid: '',
                unit: settings["unitType"] === 'metric' ? 'c' : 'f',
                success: function (weather) {
                    fulfill([weather]);
                },
                error: function (error) {
                    reject(error);
                }
            })
        };

        window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Plugin)
    })(window);

Now open the Dashboard in your browser and go to `Plugins` -> Load from URL: `plugins/weatherDatasource.js` -> `Load Plugin`

You should now see the plugin in the list of Datasource Plugins.
`Close` the dialog and add a new Datasource (`Datasources` -> `Add Datasource`). Select your plugin (`Weather`) and fill the settings.

To see the data add a text Widget (`Add Widget` -> `Text`) and select your datasource. Now you see what you datasource provides to the widget.

## Step 3: Create your own widget

We got our Weather Datasource up and running. Now it's time to make the visualisation a little more nice.

Create a new file `plugins/weatherWidget.js`
And add some code:

    (function (window) {

        const TYPE_INFO = {
            type: 'simpleweatherjs-widget',
            name: 'Weather',
            description: 'Visualize Weather data',
            settings: [
                {
                    id: 'datasource',
                    name: 'Datasource',
                    type: 'datasource',
                    description: "Datasource to get the weather data"
                }
            ]
        };

        class Plugin extends React.Component {
            render() {
                const props = this.props;
                const settings = props.state.settings;

                const allData = props.getData(settings.datasource);


                if(allData.length === 0) {
                    return <div>No Data {JSON.stringify(data)}</div>
                }

                const data = allData[allData.length - 1];
                const units = data.units || {};

                return <div style={{padding: 5}}>
                    <h1>{data.city}, {data.country}</h1>
                    <p>{data.updated}</p>
                    <p><img className="ui left floated small image" src={data.image} />
                        <span>
                            Temp: {data.temp} {units.temp}<br />
                            Humidity: {data.humidity} %<br />
                            Pressure: {data.pressure} {units.pressure}
                        </span>
                    </p>

                    </div>
            }
        }

        window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Plugin)
    })(window);


Now open the Dashboard in your browser and go to `Plugins` -> Load from URL: `plugins/weatherWidget.js` -> `Load Plugin`

You should now see the plugin in the list of Widget Plugins.
`Close` the dialog and add a new Widget (`Add Widget` -> `Weather`) and select your weather datasource from Step 2 in the settings.

Now you should see your weather widget. Feel free to play around with the code of the Widget and Datasource.

Any problems until here? Feel free to submit an issue or contact us in [![Gitter](https://badges.gitter.im/Niondir/iot-dashboard.svg)](https://gitter.im/Niondir/iot-dashboard?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)
