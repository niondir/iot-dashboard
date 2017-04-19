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