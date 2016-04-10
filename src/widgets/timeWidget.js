import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'

export const TYPE_INFO = {
    type: "time",
    name: "Timer"
};


export class Widget extends Component {

    renderTime() {
        const currentTime = new Date();
        let diem = 'AM';
        let h = currentTime.getHours();
        let m = currentTime.getMinutes();
        let s = currentTime.getSeconds();

        if (h === 0) {
            h = 12;              
        } else if (h > 12) {
            h = h - 12;
            diem = 'PM';
        }

        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return {
            hours: h,
            minutes: m,
            seconds: s,
            diem
        };
    };

    componentWillMount() {
        this.intervals = [];
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    constructor(props) {
        super(props);
        this.state = this.renderTime();
    }

    componentDidMount() {
        this.setInterval(() => this.tick(), 1000);
    }

    tick() {
        let time = this.renderTime();
        this.setState({hours: time.hours, minutes: time.minutes, seconds: time.seconds, diem: time.diem});
    }

    render() {
        return <p className=''>
            { this.state.hours }:{ this.state.minutes }:{ this.state.seconds }
            <span className=''> { this.state.diem }</span>
        </p>
    }
}