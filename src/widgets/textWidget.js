import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as WidgetConfig from './widgetConfig'
import * as Widgets from './widgets'

export const TYPE_INFO = {
    type: "text",
    name: "Text"
};

export class Widget extends Component {

    render() {
        return <p>{this.props.text}</p>
    }
}

class ConfigDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * Handle positive action on the config dialog.
     * Return false to prevent closing.
     * Return the widget props that should be used for the widget after save
     */
    handlePositive() {
        let result = {
            text: this.input.value
        };
        this.input.value = "";
        return result;

    }

    handleDeny() {
        this.input.value = "";
        return true;
    }

    render() {
        if (this.input) {
            this.input.value = this.props.widgetProps.text || "";
        }
        return <div className="content">
            <form className="ui form">
                <div className="field">
                    <label>Text</label>
                    <input type="text" name="first-name" placeholder="Content of the widget"
                           defaultValue={this.props.widgetProps.text}
                           ref={node => { this.input = node;}}
                    />
                </div>
            </form>
        </div>
    }
}

export {ConfigDialog}