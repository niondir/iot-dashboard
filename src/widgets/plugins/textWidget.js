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
        },
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
        const ds = props.getDatasource(this.props.datasource);

        //console.log("Datasource:", ds);
        if(!ds) {
            return <p>Missing datasource: {this.props.datasource}</p>
        }
        
        return <p>{JSON.stringify(ds.data)}</p>
    }
}