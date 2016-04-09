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

// TODO: We should get it generic and only base it on the Widget state
class ConfigDialog extends React.Component {

    modalApply() {
        this.props.dispatch(WidgetConfig.updateWidgetProps({text: (Math.random() * 1000).toFixed()}))
    }

    modalCancel() {
    }

    render() {
        return <Modal className={`config-widget-${TYPE}`} title="Configure Text Widget"
                      positive={() => this.modalApply()}
                      deny={() => this.modalCancel()}>
            <div className="content">
                <a className="" href="#" onMouseEnter={() => console.log("oh please")}>
                    My Link
                </a>
                <form className="ui form">
                    <div className="field">
                        <label>Text</label>
                        <input type="text" name="first-name" placeholder="Content of the widget"/>
                    </div>
                </form>
            </div>
        </Modal>
    }
}

const ConfigDialogContainer = connect((state) => {
    return {
        widgetProps: state.widgetConfig.widgetProps
    }
})(ConfigDialog);


export {ConfigDialogContainer as ConfigDialog}