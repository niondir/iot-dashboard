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

const initialState = {text: ""};

class ConfigDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    /**
     * Handle positive action on the config dialog.
     * Return false to prevent closing.
     * Return the widget props that should be used for the widget after save
     */
    handlePositive() {
        let state = this.state;
        this.setState(initialState);
        return state;
    }

    handleDeny() {
        return true;
    }

    render() {
        return <div className="content">
            <form className="ui form">
                <div className="field">
                    <label>Text</label>
                    <input type="text" name="first-name" placeholder="Content of the widget"
                           value={this.state.text}
                        onChange={(e) => this.setState({text: e.target.value})}
                    />
                </div>
            </form>
        </div>
    }
}

export {ConfigDialog}