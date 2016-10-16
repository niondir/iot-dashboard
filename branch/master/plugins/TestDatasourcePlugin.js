"use strict";

(function () {

    var TYPE_INFO = {
        type: "test-datasource",
        name: "Test Source",
        description: "Static test value",
        // dependencies: ["/path/to/some.js"]
        settings: [{
            id: "value",
            name: "Value",
            description: "Datasource returns this value",
            type: "json"
        }]
    };

    function safeParseJsonObject(string) {
        try {
            return JSON.parse(string);
        } catch (e) {
            console.error("Was not able to parse JSON: " + string);
            return {};
        }
    }

    function Datasource() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var history = arguments[1];


        this.props = props;

        this.updateProps = function (props) {
            this.props = props;
        };

        this.getValues = function () {
            var valueString = this.props.value;
            return [safeParseJsonObject(valueString)];
        };
    }

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);
})();