(function () {

    var TYPE_INFO = {
        type: "google-maps",
        name: "Google Maps",
        rendering: "react", // can be: "dom", "string", "react" (TODO: Not all supported yet)
        description: "Render Google Maps with some Location Data",
        dependencies: [
            /* TODO Load at runtime based on API KEY */
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyBLYUpsjXqon1XGBtnDx6EZzOirIoAB3Dg'
        ],
        settings: [
            {
                id: 'datasource',
                name: 'Datasource',
                type: 'datasource',
                description: "Datasource to get the gps values from"
            },
            {
                id: 'gpsProp',
                name: 'GPS Property',
                type: 'string',
                defaultValue: 'gps',
                description: "Key of Value object that has GPS data in format: {lat: 53.47, lng:9.93}"
            },
            {
                id: 'apiKey',
                name: 'Api Key',
                type: 'string',
                defaultValue: 'AIzaSyBLYUpsjXqon1XGBtnDx6EZzOirIoAB3Dg',
                description: "Google Maps API Key"
            }
            // Add Center  {lat: -34.397, lng: 150.644}

        ]
    };

    // The API is similar to React but it is actually NOT a react component.
    // On render you get the DOM "element" to renter the content.
    var Widget = React.createClass({
        getInitialState: function() {
            return {};
        },
        componentDidMount: function () {
            /* TODO use widget id in element id */
            var map = new google.maps.Map(document.getElementById('map-' + this.props._state.id), {
                center: {lat: 53.5483402, lng: 9.9656092},
                zoom: 12
            });
            this.setState({map: map})
        },
        render: function () {
            var props = this.props;
            const config = props.config;

            var data = props.getData(config.datasource);

            var gpsPoints = _.map(data, function (value) {
                return value[config.gpsProp];
            });

            var path = new google.maps.Polyline({
                path: gpsPoints,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            if (this.state.map) {
                path.setMap(this.state.map);
            }

            return React.DOM.div({id: 'map-' + props._state.id, style: {height: "100%"}}, "Hello World!");
        }
    });

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);

})();