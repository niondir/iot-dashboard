(function () {

    var TYPE_INFO = {
        type: "google-maps",
        name: "Google Maps",
        rendering: "react",
        description: "Render Google Maps with some Location Data",
        dependencies: [
            /* TODO Load at runtime based on API KEY, might need dashboard wide configuration */
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
                id: 'initLat',
                name: 'Initial Latitude',
                type: 'number',
                defaultValue: 53.472435000000004,
                description: "Latitude when the map is loaded"
            },
            {
                id: 'initLng',
                name: 'Initial Longitude',
                type: 'number',
                defaultValue: 9.933285,
                description: "Longitude when the map is loaded"
            },
            {
                id: 'initZoom',
                name: 'Initial Zoom',
                type: 'number',
                defaultValue: 15,
                description: "Zoom level when the map is loaded"
            },
            {
                id: 'gpsProp',
                name: 'GPS Property',
                type: 'string',
                defaultValue: 'gps',
                description: "Key of Value object that has GPS data in format: {lat: 53.47, lng:9.93}"
            }
        ]
    };

    // The API is similar to React but it is actually NOT a react component.
    // On render you get the DOM "element" to renter the content.
    var Widget = React.createClass({
        getInitialState: function () {
            return {};
        },
        componentDidMount: function () {
            var map = new google.maps.Map(document.getElementById('map-' + this.props._state.id), {
                center: {lat: this.props.config.initLat, lng: this.props.config.initLng},
                zoom: Number(this.props.config.initZoom)
            });
            this.setState({map: map})
        },
        componentWillReceiveProps(nextProps) {
            if (nextProps._state.availableHeightPx != this.props._state.availableHeightPx) {
                google.maps.event.trigger(this.state.map, 'resize');
            }
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