
(function() {

    var TYPE_INFO = {
        type: "test-widget2",
        name: "Test Widget2",
        rendering: "dom", // can be: "dom", "string", "react" (TODO: Not all supported yet)
        description: "Just rendering the data as text",
        dependencies: [
            "https://code.jquery.com/jquery-1.12.4.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.js"
        ],
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
        var jq = $.noConflict();

        console.log("2 - d3.version", d3.version);
        this.render = function (props, element) {
            const data = props.getData(props.config.datasource);

            let html = "";
            if(!data || data.length == 0) {
                html = "<p>No data</p>"
            }

            var jqueryVersion = "";
            try {
                jqueryVersion = jq.fn.jquery;
            }catch(e) {}
            html = "<p>" + jqueryVersion + " - 2 - " + JSON.stringify(data)+ "</p>";
            //$(element).html(html);
            element.innerHTML = html;
        }


    }

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);

})();