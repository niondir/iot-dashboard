import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'

export const TYPE_INFO = {
    type: "text",
    description: "Display content of a datasource as plain text",
    settings: [
        {
            id: 'datasource',
            name: 'Datasource',
            type: 'datasource',
            description: "Datasource to get the text"
        }
    ]
};

export class Widget extends Component {

    render() {
        const props = this.props;
        const data = props.getData(this.props.datasource);

        if(!data || data.length == 0) {
            return <p>No data</p>
        }
        
        return <p>{JSON.stringify(data)}</p>
    }
}