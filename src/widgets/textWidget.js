import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'


export class TextWidget extends Component {

    render() {
        return <p>{this.props.text}</p>
    }
}