
(function() {

    var TYPE_INFO = {
        type: "google-maps",
        name: "Google Maps",
        rendering: "react", // can be: "dom", "string", "react" (TODO: Not all supported yet)
        description: "Render Google Maps with some Location Data",
        dependencies: [
        ],
        settings: [
            {
                id: 'path',
                name: 'Datasource',
                type: 'datasource',
                description: "Datasource to get the text"
            }
        ]
    };

    // The API is similar to React but it is actually NOT a react component.
    // On render you get the DOM "element" to renter the content.
    var Widget = React.createClass({
        render: function(props) {
            return React.DOM.div(null, "Hello World!");
        }
    });

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);

})();