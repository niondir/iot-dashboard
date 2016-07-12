import * as React from "react";
import {PropTypes as Prop} from "react";
import * as Uuid from "../util/uuid.js";
import * as _ from "lodash";
import {genCrudReducer} from "../util/reducer.js";
import * as Action from "../actionNames.js";
import * as AppState from "../appState";
import objectAssign = require("object-assign");

export const HEADER_HEIGHT = 77;
export const ROW_HEIGHT = 100;

export interface IWidgetsState {
    [key: string]: IWidgetState
}

export interface IWidgetState {
    id: string;
    type: string;
    name: string;
    props: any;
    row: number;
    col: number;
    width: number;
    height: number;
    availableHeightPx: number;
}

// From react-grid-layout
interface Layout {
    i: string
    x: number
    y: number
    w: number
    h: number
}

export const initialWidgets: IWidgetsState = {
    "initial_chart": {
        "id": "initial_chart",
        "type": "chart",
        "name": "chart",
        "props": {
            "name": "Random Values",
            "datasource": "initial_random_source",
            "chartType": "area-spline",
            "dataKeys": "[\"value\"]",
            "xKey": "x",
            "names": "{\"value\": \"My Value\"}",
            "gaugeData": "{\"min\":0,\"max\":100,\"units\":\" %\"}"
        },
        "row": 0,
        "col": 0,
        "width": 6,
        "height": 2,
        "availableHeightPx": 123
    },
    "initial_text": {
        "id": "initial_text",
        "type": "text",
        "name": "text",
        "props": {
            "name": "Random data",
            "datasource": "initial_random_source"
        },
        "row": 0,
        "col": 6,
        "width": 6,
        "height": 3,
        "availableHeightPx": 223
    },
    "106913f4-44fb-4f69-ab89-5d5ae857cf3c": {
        "id": "106913f4-44fb-4f69-ab89-5d5ae857cf3c",
        "type": "chart",
        "name": "chart",
        "props": {
            "name": "Bars",
            "datasource": "initial_random_source",
            "chartType": "spline",
            "dataKeys": "[\"value\", \"value2\"]",
            "xKey": "x",
            "names": "{\"value\": \"My Value\"}",
            "gaugeData": "{\"min\":0,\"max\":100,\"units\":\" %\"}"
        },
        "row": 2,
        "col": 0,
        "width": 6,
        "height": 2,
        "availableHeightPx": 123
    }
};


export const widgetPropType = Prop.shape({
    id: Prop.string.isRequired,
    col: Prop.number.isRequired,
    row: Prop.number.isRequired,
    width: Prop.number.isRequired,
    height: Prop.number.isRequired,
    props: Prop.shape({
        name: Prop.string.isRequired
    }).isRequired
});

export function addWidget(widgetType: string, widgetProps: any = {}, width: number = 3, height: number = 3): AppState.Action {
    return (dispatch: AppState.Dispatch, getState: AppState.GetState) => {
        let widgets = getState().widgets;
        const widgetPositions = calcNewWidgetPosition(widgets);

        return dispatch({
            type: Action.ADD_WIDGET,
            id: Uuid.generate(),
            col: widgetPositions.col,
            row: widgetPositions.row,
            width,
            height,
            widgetType,
            widgetProps
        });
    }
}

export function updateWidgetProps(id: string, widgetProps: any = {}) {
    return {
        type: Action.UPDATE_WIDGET_PROPS,
        id,
        widgetProps
    }
}

export function deleteWidget(id: string) {
    return {
        type: Action.DELETE_WIDGET,
        id
    }
}

export function updateLayout(layout: Layout) {
    return {
        type: Action.UPDATE_WIDGET_LAYOUT,
        layout: layout
    }
}

const widgetsCrudReducer: Function = <Function>genCrudReducer([Action.ADD_WIDGET, Action.DELETE_WIDGET], widget);
export function widgets(state: IWidgetsState = initialWidgets, action: any): IWidgetsState {
    state = widgetsCrudReducer(state, action);
    switch (action.type) {
        case Action.UPDATE_WIDGET_LAYOUT:
            return _.valuesIn<IWidgetState>(state)
                .reduce((newState, {id}) => {
                        newState[id] = widget(newState[id], action);
                        return newState;
                    }, objectAssign({}, state)
                );
        case Action.LOAD_LAYOUT:
            console.assert(action.layout.widgets, "Layout is missing Widgets, id: " + action.layout.id);
            return action.layout.widgets || {};
        case Action.DELETE_WIDGET_PLUGIN: // Also delete related widgets // TODO: Or maybe not when we render an empty box instead
            const toDelete = _.valuesIn<IWidgetState>(state).filter(widgetState => {
                return widgetState.type == action.id
            });
            var newState = objectAssign({}, state);
            toDelete.forEach(widgetState => {
                delete newState[widgetState.id];
            });

            return newState;
        default:
            return state;
    }
}

function calcAvaliableHeight(heightUnits: number): number {
    return (heightUnits * (ROW_HEIGHT + 10)) - HEADER_HEIGHT;
}

function widget(state: IWidgetState, action: any): IWidgetState {
    switch (action.type) {
        case Action.ADD_WIDGET:
            return {
                id: action.id,
                type: action.widgetType,
                name: action.widgetType,
                props: action.widgetProps,
                row: action.row,
                col: action.col,
                width: action.width,
                height: action.height,
                availableHeightPx: calcAvaliableHeight(action.height)
            };
        case Action.UPDATE_WIDGET_PROPS:
            return objectAssign({}, state, {props: action.widgetProps});
        case Action.UPDATE_WIDGET_LAYOUT:
            let layout = layoutById(action.layout, state.id);
            if (layout == null) {
                console.warn("No layout for widget. Skipping update of position. Id: " + state.id);
                return state;
            }
            return objectAssign({}, state, {
                row: layout.y,
                col: layout.x,
                width: layout.w,
                height: layout.h,
                // The 10 px extra seem to be based on a bug in the grid layout ...
                availableHeightPx: calcAvaliableHeight(layout.h)
            });
        default:
            return state;
    }
}

// Local functions

function layoutById(layout: Layout[], id: string) {
    return _.find(layout, (l) => {
        return l.i === id;
    });
}

function calcNewWidgetPosition(widgets: IWidgetsState): {col: number, row: number} {
    let colHeights: any = {};
    // TODO: Replace 12 with constant for number of columns
    // This is different on different breaking points...
    for (let i = 0; i < 12; i++) {
        colHeights[i] = 0;
    }
    colHeights = _.valuesIn<IWidgetState>(widgets).reduce((prev, curr) => {
        prev[curr.col] = prev[curr.col] || 0;
        let currHeight = curr.row + curr.height || 0;
        if (prev[curr.col] < currHeight) {
            for (let i = curr.col; i < curr.col + curr.width; i++) {
                prev[i] = currHeight;
            }
        }
        return prev;
    }, colHeights);


    const heights: number[] = _.valuesIn<number>(colHeights);
    const col = _.keysIn(colHeights).reduce<number>((a, b, index, array) => {
        return Number(colHeights[a] <= colHeights[b] ? a : b);
    }, 0);
    //Math.min(...colHeights);
    return {col: col, row: Math.min(...heights) + 1}
}