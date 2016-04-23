import * as React from 'react'
import {Component} from 'react'
import * as d3 from 'd3';
import * as c3 from 'c3';


export const TYPE_INFO = {
    type: "chart",
    description: "Renders a line chart. Will be way more flexible in future.",
    settings: [
        {
            id: 'datasource',
            name: 'Datasource',
            type: 'datasource'
        }
    ]
};


export class Widget extends Component {

    componentDidMount() {
        this._createChart();
    }

    _createChart() {
        this.chart = c3.generate({
            bindto: '#chart-' + this.props._state.id,
            size: {
                //width: 500,
                height: this.props._state.height * 200 - 77
            },
            data: {
                json: []
            },
            axis: {
                x: {
                    //label: "foo"
                }
            },
            transition: {
                duration: 0
            },
            type: 'spline'
        })
    }

    _renderChart() {
        if (!this.chart) {
            return;
        }
        const props = this.props;
        const data = props.getData(this.props.datasource);

        this.chart.load({
            json: data,
            //unload: false,
            keys: {
                x: "x",
                value: ["value"]
            },
            labels: false,
            names: {
                value: 'Random Values'
            }
        });


    }

    render() {
        this._renderChart();
        return <div className="" id={'chart-' + this.props._state.id}></div>
    }
}

