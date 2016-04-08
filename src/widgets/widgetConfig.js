import * as React from 'react'
import $ from 'jquery'

const initialState = {
    visible: false,
    widgetType: null
};

const SHOW_MODAL = "SHOW_WIDGET_CONFIG_MODAL";
export function showModal(widgetType:String) {
    return {
        type: SHOW_MODAL,
        widgetType: widgetType
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






