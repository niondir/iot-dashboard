"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

    // Digimondo Frontend: https://frontend.digimondo.io/login

    // https://api.digimondo.io/v1/aaaaaaaabbccddff?auth=3a9fce0d7fd743e56010d770d7432f6f&limitToLast=10
    // &offset=10
    // &payloadonly
    // TODO: Make a boolean flag to only receive new values based on "receivedAfter" set to last received value

    var TYPE_INFO = {
        type: "digimondo-firefly-datasource",
        name: "Digimondo Firefly",
        version: "0.0.1",
        author: "Lobaro",
        kind: "datasource",
        description: "Fetch parsed data from the Digimondo API",
        dependencies: ["https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment-with-locales.min.js"],
        settings: [{
            id: "auth",
            name: "Auth Token",
            description: "Digimondo Authentication Token (Secret API Key)",
            defaultValue: "",
            required: true,
            type: "string"
        }, {
            id: "deviceEui",
            name: "Filter Device EUI",
            description: "Only parse data from given Device EUI",
            defaultValue: "",
            type: "string"
        }, {
            id: "limitToLast",
            name: "Limit",
            description: "The amount Packets to be returned. Ordered by creation date, descending (unless otherwise specified through the direction parameter). Default value is 1 Maximum value is 100.",
            defaultValue: 0,
            type: "number"
        }, {
            id: "offset",
            name: "Offset",
            description: "The amount of most recent Packets to skip before returning Packets. Default value is 0.",
            defaultValue: 0,
            type: "number"
        }, {
            id: "direction",
            name: "Direction",
            description: "When set to asc, it will return the oldest Packets first. When set to desc, it will return the most recent packets. Default is desc.",
            defaultValue: "",
            type: "string"
        }, {
            id: "fetchInterval",
            name: "Fetch Interval",
            description: "How ofter should data be fetched in ms",
            defaultValue: "1000",
            type: "number"
        }, {
            id: "baseUrl",
            name: "Base Url (trailing slash)",
            description: "Digimondo API Base Url",
            defaultValue: "http://firefly.lobaro.com/api/v1/",
            required: true,
            type: "string"
        }]
    };

    var Datasource = function () {
        function Datasource() {
            _classCallCheck(this, Datasource);
        }

        _createClass(Datasource, [{
            key: "initialize",
            value: function initialize(props) {
                if (props.state.settings.fetchInterval) {
                    props.setFetchInterval(props.state.settings.fetchInterval);
                }
            }
        }, {
            key: "datasourceWillReceiveSettings",
            value: function datasourceWillReceiveSettings(nextSettings) {
                if (nextSettings.fetchInterval) {
                    this.props.setFetchInterval(nextSettings.fetchInterval);
                }
            }
        }, {
            key: "getLatestRecivedAt",
            value: function getLatestRecivedAt() {}
        }, {
            key: "fetchData",
            value: function fetchData(resolve, reject) {

                var settings = this.props.state.settings;
                var oldData = this.props.state.data;
                var receivedAfter = null;

                if (oldData.length > 0) {
                    var latestPacket = _.reduce(oldData, function (result, value) {
                        if (moment(value.received_at).isAfter(moment(result.received_at))) {
                            return value;
                        }
                        return result;
                    });

                    if (latestPacket) {
                        receivedAfter = latestPacket.received_at;
                    }
                }

                var request = new Request(settings.baseUrl + "devices/eui/" + settings.deviceEui + "/packets" + "?auth=" + settings.auth + (settings.limitToLast ? "&limit_to_last=" + settings.limitToLast : "") + (settings.offset ? "&offset=" + settings.offset : "") + (settings.direction ? "&direction=" + settings.direction : "") + (receivedAfter ? "&received_after=" + receivedAfter : "") + "&payloadonly=true", {
                    //mode: "no-cors"
                });
                fetch(request).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    var parsedData = _.map(data.packets, function (d) {
                        return _.assign({}, d.parsed, { received_at: d.received_at });
                    });
                    parsedData = _.sortBy(parsedData, function (d) {
                        return d.received_at;
                    });
                    resolve(parsedData);
                });
            }
        }]);

        return Datasource;
    }();

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);
})();