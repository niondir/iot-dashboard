import * as React from 'react'
import $ from 'jquery'
import * as Widgets from './widgets'

export function widgetProps(state = {}, action) {
    switch (action.type) {
        default:
            return state;
    }
}

export const WidgetConfigDialogs = () => {
    let i = 0;
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
        dispatch(showModal(type, (approved) => {
            if (approved) {
                // TODO: Overwirte initial props by user props
                dispatch(Widgets.addWidget(type, initialProps));
            }
            return true;
        }));
    }
}

const SHOW_MODAL = "SHOW_WIDGET_CONFIG_MODAL";
export function showModal(widgetType:String, callaback:Function) {
    return dispatch => {
        $(`.ui.modal.config-widget-${widgetType}`)
            .modal('setting', 'closable', false)
            .modal('setting', 'debug', false)
            .modal('setting', 'onApprove', ($element) => {
                return callaback(true);
            })
            .modal('setting', 'onDeny', ($element) => {
                return callaback(false);
            })
            .modal('show');
        dispatch({
            type: SHOW_MODAL,
            widgetType: widgetType
        });
    }
}

const CLOSE_MODAL = "CLOSE_WIDGET_CONFIG_MODAL";
export function closeModal(success = false) {
    return {
        type: CLOSE_MODAL
    }
}

function configDialog(state = initialState, action) {
    switch (action.type) {
        case SHOW_MODAL:
            return {
                ...state,
                visible: true,
                widgetType: action.widgetType
            };
        case CLOSE_MODAL:
            return {
                ...state,
                visible: false,
                widgetType: null
            };
        default:
            return state;
    }
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function myLog(obj) {
    console.log(obj);
    return obj;
}

export class Modal extends React.Component {

    componentDidMount() {
        $('.ui.modal').modal({detachable: false});
    }

    render() {
        return <div className={"ui modal " + this.props.className}>

            <div className="header">
                {this.props.title}
            </div>
            {this.props.children}
            <div className="actions">
                <div className="ui black deny button" onClick={this.props.deny}>
                    Cancel
                </div>
                <div className="ui positive right labeled icon button"
                     onClick={this.props.positive}>
                    Save
                    <i className="checkmark icon"></i>
                </div>
            </div>
        </div>
    }
}






