import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'
import {Modal} from './widgetConfig'
import * as WidgetConfig from './widgetConfig'
import * as Widgets from './widgets'

export const TYPE = "text";

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

    modalApply() {
        this.props.dispatch(Widgets.addWidget(TYPE, Object.assign({}, {text: this.state.text})));
        this.setState(initialState);
    }

    modalCancel() {
    }

    render() {
        return <Modal widgetType={TYPE} title="Configure Text Widget"
                      positive={() => this.modalApply()}
                      deny={() => this.modalCancel()}>
            <div className="content">
                <form className="ui form">
                    <div className="field">
                        <label>Text</label>
                        <input type="text" name="first-name" placeholder="Content of the widget"
                               value={this.state.text}
                               onChange={(e) => this.setState({text: e.target.value})}/>
                    </div>
                </form>
            </div>
        </Modal>
    }
}




export {ConfigDialog}