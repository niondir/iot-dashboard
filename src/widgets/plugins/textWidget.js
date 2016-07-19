/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import {Component} from 'react';
import {PropTypes as Prop}  from "react";

export const TYPE_INFO = {
    type: "text",
    name: "Text",
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
        const data = props.getData(props.state.settings.datasource);

        if(!data || data.length == 0) {
            return <p>No data</p>
        }

        return <div style={{padding: "10px"}}><p>{JSON.stringify(data)}</p></div>
    }
}

// TODO: Move to core, for simple reuse
Widget.propTypes = {
    getData: Prop.func.isRequired,
    state: Prop.shape({
        height: Prop.number.isRequired,
        id: Prop.string.isRequired
    }).isRequired
};