import * as React from 'react'
import {Component} from 'react'
import * as d3 from 'd3';
import * as c3 from 'c3';


export const TYPE_INFO = {
    type: "chart",
    defaultProps: {
        name: "Chart"
    }
};


export class Widget extends Component {

    constructor(props) {
        super(props);
        let i = 1;
        this.state = {
            data: [
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100},
                {x: i++, "value": Math.random()*100}
            ]
        };
    }


    componentDidMount() {
        this._renderChart(this.state.data);
    }


    _renderChart(data) {
        var donutChart = c3.generate({
            bindto: '#chart_1',
            size: {
                //width: 500,
                height: this.props._state.height * 200 - 77
            },
            data: {
                json: data,
                keys: {
                    value: ["value"]
                },
                labels: false,
                names: {
                    value: 'Random Values'
                }
            },
            axis: {
                x: {
                    //label: "foo"
                }
            },
            type: 'spline'
        })
    }

    render() {
        this._renderChart(this.state.data);
        return <div className="" id="chart_1"></div>
    }
}

