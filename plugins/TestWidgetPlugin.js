
(function() {

    var TYPE_INFO = {
        type: "test-widget",
        name: "Test Widget",
        rendering: "dom", // can be: "dom", "string", "react" (TODO: Not all supported yet)
        description: "Just rendering the data as text",
        // dependencies: ["/path/to/some.js"]
        settings: [
            {
                id: 'datasource',
                name: 'Datasource',
                type: 'datasource',
                description: "Datasource to get the text"
            }
        ]
    };

    function safeParseJsonObject(string) {
        try {
            return JSON.parse(string);
        }
        catch (e) {
            console.error("Was not able to parse JSON: " + string);
            return {}
        }
    }


    // The API is similar to React but it is actually NOT a react component.
    // On render you get the DOM "element" to renter the content.
    function Widget(props = {}) {
        this.render = function (props, element) {
            const data = props.getData(props.config.datasource);

            let html = "";
            if(!data || data.length == 0) {
                html = "<p>No data</p>"
            }

            html = "<p>" + JSON.stringify(data)+ "</p>";
            element.innerHTML = html;
        }


    }

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);

})();