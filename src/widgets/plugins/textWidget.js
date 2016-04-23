import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'

export const TYPE_INFO = {
    type: "text",
    settings: [
        {
            id: 'text',
            name: 'Text',
            type: 'string',
            description: "Some text that will be displayed ..."
        }
    ]
};

export class Widget extends Component {

    render() {
        return <p>{this.props.text}</p>
    }
}