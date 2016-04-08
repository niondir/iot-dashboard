import * as React from 'react'
import $ from 'jquery'
import * as WidgetGrid from '../widgetGrid'
import * as Widgets from './widgets'

const initialState = {
    visible: false,
    widgetType: null
};

export const WidgetConfigDialogs = () => {
    const configDialogs = Widgets.getWidgets().map((widget) => {
            return widget.configDialog ? React.createElement(widget.configDialog, {}) : null;
        });
    return <div>{configDialogs}</div>
};

export function createWidget(type, initialProps = {}) {
    const widget = Widgets.getWidget(type);
    return (dispatch, getState) => {
        if (!widget.configDialog) {
            dispatch(WidgetGrid.addWidget(type, initialProps));
            return;
        }
        dispatch(showModal(type, (approved) => {
            if (approved) {
                // TODO: Overwirte initial props by user props
                dispatch(WidgetGrid.addWidget(type, initialProps));
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
            .modal('setting', 'onApprove', ($element) => {

                let r = callaback(true);
                console.log("r: " + r);
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

export class Modal extends React.Component {
    render() {
        return <div className={"ui modal " + this.props.className}>

            <div className="header">
                {this.props.title}
            </div>
            {this.props.children}
            <div className="actions">
                <div className="ui black deny button">
                    Cancel
                </div>
                <div className="ui positive right labeled icon button">
                    Save
                    <i className="checkmark icon"></i>
                </div>
            </div>
        </div>
    }
}






