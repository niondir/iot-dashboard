import * as React from 'react';
import {connect} from 'react-redux'
import * as Uuid from '../util/uuid'
import * as WidgetConfig from './widgetConfig'
import WidgetPlugins from './widgetPlugins'
import {valuesOf} from '../util/collection'
import {genCrudReducer} from '../util/reducer'
import {LOAD_LAYOUT, ADD_WIDGET, UPDATE_WIDGET_PROPS, DELETE_WIDGET, UPDATE_WIDGET_LAYOUT, DASHBOARD_IMPORT} from '../actionNames'

export const initialWidgets = {
    "initial_time_widget": {
        type: "time",
        id: "initial_time_widget",
        row: 0,
        col: 0,
        width: 1,
        height: 1,
        props: {name: "Time"}
    },
    "initial_text_widget": {
        type: "text",
        id: "initial_text_widget",
        row: 0,
        col: 1,
        width: 3,
        height: 1,
        props: {
            name: "Text",
            text: "This is a text widget"
        }
    }
};


export function addWidget(widgetType, widgetProps = {}, width = 1, height = 1) {
    return (dispatch, getState) => {
        let widgets = getState().widgets;

        return dispatch({
            type: ADD_WIDGET,
            id: Uuid.generate(),
            ...calcNewWidgetPosition(widgets),
            width,
            height,
            widgetType,
            widgetProps
        });
    }
}

export function configureWidget(widgetState) {
    return function (dispatch, getState) {
        const state = getState();
        if (state.widgetTypes[widgetState.type].configurable) {
            WidgetConfig.ConfigDialog.showModal(widgetState.type);
            //dispatch();
        }
    }
}

export function updateWidgetProps(id, widgetProps = {}) {
    return {
        type: UPDATE_WIDGET_PROPS,
        id,
        widgetProps
    }
}

export function deleteWidget(id) {
    return {
        type: DELETE_WIDGET,
        id
    }
}

export function updateLayout(layout) {
    return {
        type: UPDATE_WIDGET_LAYOUT,
        layout: layout
    }
}

const widgetsCrudReducer = genCrudReducer([ADD_WIDGET, DELETE_WIDGET], widget);
export function widgets(state = initialWidgets, action) {
    state = widgetsCrudReducer(state, action);
    switch (action.type) {
        case UPDATE_WIDGET_LAYOUT:
            return valuesOf(state)
                .reduce((newState, {id}) => {
                        newState[id] = widget(newState[id], action);
                        return newState;
                    }, {...state}
                );
        case LOAD_LAYOUT:
            console.assert(action.layout.widgets, "Layout is missing Widgets, id: " + action.layout.id);
            return action.layout.widgets || {};
        default:
            return state;
    }
}

function widget(state = {}, action) {
    switch (action.type) {
        case ADD_WIDGET:
            return {
                id: action.id,
                type: action.widgetType,
                name: action.widgetType,
                props: action.widgetProps,
                row: action.row,
                col: action.col,
                width: action.width,
                height: action.height
            };
        case UPDATE_WIDGET_PROPS:
            return {
                ...state,
                props: action.widgetProps
            };
        case UPDATE_WIDGET_LAYOUT:
            let layout = layoutById(action.layout, state.id);
            return {
                ...state,
                row: layout.y,
                col: layout.x,
                width: layout.w,
                height: layout.h
            };
        default:
            return state;
    }
}

// Local functions

function layoutById(layout:Array, id) {
    return layout.find((l) => {
        return l.i === id;
    })
}

function calcNewWidgetPosition(widgets:Object) {
    let colHeights = {};
    for (let i = 0; i < 6; i++) {
        colHeights[i] = 0;
    }
    colHeights = valuesOf(widgets).reduce((prev, curr) => {
        prev[curr.col] = prev[curr.col] || 0;
        let currHeight = curr.row + curr.height || 0;
        if (prev[curr.col] < currHeight) {
            for (let i = curr.col; i < curr.col + curr.width; i++) {
                prev[i] = currHeight;
            }
        }
        return prev;
    }, colHeights);

    const heights = valuesOf(colHeights);
    const col = Object.keys(colHeights).reduce((a, b) => {
        return Number(colHeights[a] <= colHeights[b] ? a : b);
    });
    Math.min(...colHeights);
    return {col: col, row: Math.min(...heights) + 1}
}