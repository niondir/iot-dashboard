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
                id: 'path',
                name: 'Datasource',
                type: 'datasource',
                description: "Datasource to get the text"
            },
            {
                id: 'apiKey',
                name: 'Api Key',
                type: 'string',
                defaultValue: 'AIzaSyBLYUpsjXqon1XGBtnDx6EZzOirIoAB3Dg'
            }
            // Add Center  {lat: -34.397, lng: 150.644}

        ]
    };

    // The API is similar to React but it is actually NOT a react component.
    // On render you get the DOM "element" to renter the content.
    var Widget = React.createClass({
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
            return React.DOM.div({id: 'map-' + props._state.id, style: {height:"100%"}}, "Hello World!");
        }
    });

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);

})();