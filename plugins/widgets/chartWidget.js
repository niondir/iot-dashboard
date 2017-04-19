/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function () {
    const TYPE_INFO = {
        type: "chart",
        name: "Chart",
        description: "Renders a chart. Will be way more flexible in future.",
        settings: [
            {
                id: 'datasource',
                name: 'Datasource',
                type: 'datasource'
            },
            {
                id: 'chartType',
                name: 'Chart Type',
                type: 'option',
                defaultValue: 'spline',
                options: [
                    'line',
                    'spline',
                    'step',
                    'area',
                    'area-spline',
                    'area-step',
                    'bar',
                    'scatter',
                    'pie',
                    'donut',
                    'gauge'
                ]
            },
            {
                id: 'dataKeys',
                type: "json",
                name: "Data Keys",
                description: "An array of Keys of an data object that define the data sets",
                defaultValue: '["value"]'
            },
            {
                id: 'xKey',
                type: "string",
                name: "X Key",
                description: "Key of an data object that defines the X value",
                defaultValue: "x"
            },
            {
                id: 'names',
                type: "json",
                name: "Data Names",
                description: "Json object that maps Data Keys to displayed names",
                defaultValue: '{"value": "My Value"}'
            },
            {
                id: 'gaugeData',
                type: "json",
                name: "Gauge Data",
                description: "Json object that is passed as configuration for gauge chats",
                defaultValue: JSON.stringify({"min": 0, "max": 100, units: ' %'})
            }/*,
             {
             id: 'donutData',
             type: "json",
             name: "Gauge Data",
             description: "Json object that maps Data Keys to displayed names",
             defaultValue: JSON.stringify({title: 'Title'})
             }*/
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

    function safeParseJsonArray(string) {
        try {
            return JSON.parse(string);
        }
        catch (e) {
            console.error("Was not able to parse JSON: " + string);
            return {}
        }
    }

    class Widget extends React.Component {

        componentDidMount() {
            this._createChart(this.props);
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.settings !== this.settings
                || nextProps.state.height !== this.props.state.height) {
                this._createChart(nextProps);
            }
        }

        _createChart(props) {
            const config = props.state.settings;
            const data = props.getData(config.datasource);
            this.chart = c3.generate({
                bindto: '#chart-' + props.state.id,
                size: {
                    height: props.state.availableHeightPx
                },
                data: {
                    json: data,
                    type: config.chartType,
                    // Seems not to work with chart.load, so on update props we have to recreate the chart to update
                    names: safeParseJsonObject(config.names),
                    keys: {
                        x: config.xKey ? config.xKey : undefined,
                        value: safeParseJsonArray(config.dataKeys)
                    }
                },
                axis: {
                    x: {
                        tick: {
                            culling: false
                        }
                    }
                },
                gauge: safeParseJsonObject(config.gaugeData),
                donut: {
                    label: {
                        show: false
                    }
                },
                transition: {
                    duration: 0
                }
            })

        }

        _renderChart() {
            if (!this.chart) {
                return;
            }
            const props = this.props;
            const settings = props.state.settings;
            const data = props.getData(settings.datasource);

            // TODO: Do not take last element, but all new elements ;)
            const lastElement = data.length > 0 ? data[data.length - 1] : {};


            /* chart.flow does not work with x axis categories and messes up the x values.
             this.chart.flow({
             json: [lastElement],
             keys: {
             //x: "x",//config.xKey || undefined,
             value: safeParseJsonObject(config.dataKeys)
             },
             labels: false,
             //to: firstElement[config.xKey],
             duration: 500
             });     */

            this.chart.load({
                json: data,
                keys: {
                    x: settings.xKey || undefined,
                    value: safeParseJsonObject(settings.dataKeys)
                },
                labels: false
            });


        }

        render() {
            this._renderChart();
            return <div style={{padding: "10px"}}>
                <div className="" id={'chart-' + this.props.state.id}></div>
            </div>
        }

        componentWillUnmount() {
            console.log("Unmounted Chart Widget");
        }

        dispose() {
            console.log("Disposed Chart Widget");
        }
    }

// TODO: Move to core, for simple reuse
    const Prop = React.PropTypes
    Widget.propTypes = {
        getData: Prop.func.isRequired,
        state: Prop.shape({
            height: Prop.number.isRequired,
            id: Prop.string.isRequired
        }).isRequired
    };

    window.iotDashboardApi.registerWidgetPlugin(TYPE_INFO, Widget);

})();