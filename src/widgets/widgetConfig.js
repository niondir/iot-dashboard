import * as React from 'react'
import $ from 'jquery'
import * as Widgets from './widgets'
import {connect} from 'react-redux'

const initialState = {
    type: null,
    name: null,
    props: {}
};


export function openWidgetCreateDialog(type, defaultProps) {
    return (dispatch) => {
        dispatch({
            type: "START_CREATE_WIDGET",
            widgetType: type,
            widgetProps: defaultProps
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
            widget: widget
        });
        ConfigDialog.showModal();
    }
}

export function widgetConfigDialog(state = initialState, action) {
    switch (action.type) {
        case "START_CREATE_WIDGET":
            return {
                ...state,
                type: action.widgetType,
                id: null,
                name: action.widgetType,
                props: action.widgetProps || {}
            };
        case "START_CONFIGURE_WIDGET":
            return {
                ...state,
                type: action.widget.type,
                id: action.widget.id,
                name: action.widget.name,
                props: action.widget.props
            };
        default:
            return state;
    }
}

export const WidgetConfigDialog = () => {
    return <div><ConfigDialogContainer/></div>;
};

export function createWidget(type) {
    const widget = Widgets.getWidget(type);
    return (dispatch, getState) => {
        if (!widget.configDialog) {
            dispatch(Widgets.addWidget(type, widget.defaultProps));
            return;
        }
        dispatch(openWidgetCreateDialog(type, widget.defaultProps));
    }
}


class ConfigDialog extends React.Component {

    constructor(props) {
        super(props);
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
        console.assert(
            this.refs.configForm.handlePositive,
            "props.handlePositive() is missing on widget config dialog for widget " + this.props.widgetType
        );
        let widgetProps = this.refs.configForm.handlePositive();
        if (widgetProps !== false) {
            widgetProps = {...this.props.widgetProps, ...widgetProps};
            if (this.props.widgetId) {
                this.props.dispatch(Widgets.updateWidgetProps(this.props.widgetId, widgetProps));
            }
            else {
                this.props.dispatch(Widgets.addWidget(this.props.widgetType, widgetProps));
            }
            ConfigDialog.closeModal(this.props.widgetType);
        }
    }

    handleDeny() {
        let handleDeny = this.refs.configForm.handleDeny.bind(this.refs.configForm);
        let denyResult = handleDeny ? handleDeny() : true;
        if (denyResult !== false) {
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

        return <div className={"ui modal widget-config"}>
            <div className="header">
                Configure {this.props.widgetName} Widget
            </div>
            {React.createElement(widget.configDialog, {
                ref: "configForm",
                widgetProps: this.props.widgetProps
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
        widgetId: state.widgetConfig.id,
        widgetType: state.widgetConfig.type,
        widgetName: state.widgetConfig.name,
        widgetProps: state.widgetConfig.props,
        title: "Configure Text Widget" // TODO: get this dynamically e.g from widgetState
    }
})(ConfigDialog);

export {ConfigDialogContainer as ConfigDialog}




