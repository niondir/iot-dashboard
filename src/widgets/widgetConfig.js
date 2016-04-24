import * as React from "react";
import * as Widgets from "./widgets";
import WidgetPlugins from "./widgetPlugins";
import {START_CREATE_WIDGET, START_CONFIGURE_WIDGET} from "../actionNames";
import {showDialog as showConfigDialog} from "./widgetConfigDialog.ui";
import * as Modal from '../modal/modalDialog'
import * as ModalIds from '../modal/modalDialogIds'

const initialState = {
    type: null,
    name: null,
    props: {}
};

/**
 * Triggered when the user intends to create a widget of a certain type
 */
export function createWidget(type) {
    const widget = WidgetPlugins.getPlugin(type);
    return (dispatch, getState) => {
        if (!widget.settings && widget.settings.length > 0) {
            dispatch(Widgets.addWidget(type, widget.defaultProps));
            return;
        }
        dispatch(openWidgetCreateDialog(type, widget.defaultProps));
    }
}

/**
 * Creates or updates an actual widget
 */
export function createOrUpdateWidget(id, type, props) {
    return (dispatch, getState) => {
        const state = getState();

        const widget = state.widgets[id];

        if (widget && widget.type !== type) {
            throw new Error("Can not update widget of type " + widget.type + " with props of type " + type);
        }
        if (widget) {
            dispatch(Widgets.updateWidgetProps(id, props));
        }
        else {
            dispatch(Widgets.addWidget(type, props));
        }
    }
}

export function openWidgetCreateDialog(type, defaultProps) {
    return (dispatch) => {
        dispatch({
            type: START_CREATE_WIDGET,
            widgetType: type,
            widgetProps: defaultProps
        });
        dispatch(Modal.showModal(ModalIds.WIDGET_CONFIG));
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
            type: START_CONFIGURE_WIDGET,
            widget: widget
        });
        dispatch(Modal.showModal(ModalIds.WIDGET_CONFIG));
    }
}

export function widgetConfigDialog(state = initialState, action) {
    switch (action.type) {
        case START_CREATE_WIDGET:
            return {
                ...state,
                type: action.widgetType,
                id: null,
                name: action.widgetType,
                props: action.widgetProps || {}
            };
        case START_CONFIGURE_WIDGET:
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