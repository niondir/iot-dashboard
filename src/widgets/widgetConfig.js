import * as React from 'react'
import $ from 'jquery'
import * as Widgets from './widgets'
import {connect} from 'react-redux'

const initialState = {
    widgetType: null,
    widgetProps: {}
};


export function openWidgetCreateDialog(type) {
    return (dispatch) => {
        dispatch({
            type: "START_CREATE_WIDGET",
            widgetType: type
        });
        ConfigDialog.showModal(type);
    }
}

/**
 * Open the dialog with the settings and values of the given widget
 */
export function openWidgetConfigDialog(id) {
    return (dispatch, getState) => {
        const state = getState();
        const widget = state.widgets[id];
        dispatch({
            type: "START_CONFIGURE_WIDGET",
            id: id
        });
        ConfigDialog.showModal();
    }
}

export function widgetConfigDialog(state = initialState, action) {
    switch (action.type) {
        case "START_CREATE_WIDGET":
            return {
                ...state,
                widgetType: action.widgetType,
                widgetProps: {} // no known widget props for new widgets
            };
        case "START_CONFIGURE_WIDGET":
            const widget = state.widgets[action.id];
            return {
                ...state,
                widgetType: widget.type,
                widgetProps: {
                    text: "always the same text" // TODO: use widget.props as widgetProps value
                }
            };
        default:
            return state;
    }
}

export const WidgetConfigDialogs = () => {
    let i = 0;
    return <div><ConfigDialogContainer/></div>;
    // TODO: Do we need multiple?
    const configDialogs = Widgets.getWidgets().map((widget) => {
        return widget.configDialog ? React.createElement(widget.configDialog, {key: i++}) : null;
    });
    return <div>{configDialogs}</div>
};

export function createWidget(type, initialProps = {}) {
    const widget = Widgets.getWidget(type);
    return (dispatch, getState) => {
        if (!widget.configDialog) {
            dispatch(Widgets.addWidget(type, initialProps));
            return;
        }
        dispatch(openWidgetCreateDialog(type));
    }
}


class ConfigDialog extends React.Component {

    constructor(props) {
        super(props);
        this.widgetProps = {text: "nothing set"}
    }

    componentDidMount() {
        $('.ui.modal.widget-config')
            .modal({
                detachable: false,
                closable: false,
                onApprove: ($element) => false,
                onDeny: ($element) => false
            })
    }

    static showModal() {
        $('.ui.modal.widget-config')
            .modal('show');
    }

    static closeModal() {
        $(`.ui.modal.widget-config`).modal('hide');
    }


    setWidgetProps(props) {
        this.widgetProps = props;
    }

    handlePositive() {
        let widgetProps = this.refs.configForm.handlePositive();
        if (widgetProps !== false) {
            console.log(this.refs.configForm);
            this.props.dispatch(Widgets.addWidget(this.props.widgetType, widgetProps));
            ConfigDialog.closeModal(this.props.widgetType);
        }
    }

    handleDeny() {
        let denyResult = this.refs.configForm.handleDeny();
        if (denyResult !== false) {
            console.log("closing modal");
            ConfigDialog.closeModal(this.props.widgetType);
        }
    }

    render() {
        const widget = Widgets.getWidget(this.props.widgetType);

        if (!widget) {
            return <div className={"ui modal widget-config"}>
                <h1>Invalid state. Do not know which widget to configure</h1>
            </div>
        }

        return <div className={"ui modal widget-config " + this.props.widgetType + "-widget"}>
            <div className="header">
                Configure {this.props.widgetName} Widget
            </div>
            {React.createElement(widget.configDialog, {
                ref: "configForm"
            })}
            <div className="actions">
                <div className="ui black cancel button"
                     onClick={this.handleDeny.bind(this)}>
                    Cancel
                </div>
                <div className="ui right labeled icon positive button"
                     onClick={this.handlePositive.bind(this)}>
                    Save
                    <i className="checkmark icon"></i>
                </div>
            </div>
        </div>
    }
}

const ConfigDialogContainer = connect((state) => {
    return {
        widgetType: state.widgetConfig.widgetType,
        widgetName: state.widgetConfig.widgetName,
        widgetProps: state.widgetConfig.widgetProps,
        title: "Configure Text Widget" // TODO: get this dynamically e.g from widgetState
    }
})(ConfigDialog);

export {ConfigDialogContainer as ConfigDialog}




