/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {PropTypes as Prop} from "react";
import * as Redux from "redux";
import * as Uuid from "../util/uuid.js";
import * as _ from "lodash";
import {genCrudReducer} from "../util/reducer.js";
import * as Action from "../actionNames";
import * as AppState from "../appState";

export const HEADER_HEIGHT = 77;
export const ROW_HEIGHT = 100;

export interface IWidgetsState {
    [key: string]: IWidgetState
}

export interface IWidgetPosition {
    row: number;
    col: number;
    width: number;
    height: number;
}

export interface IWidgetState extends IWidgetPosition {
    id: string;
    type: string;
    settings: any;
    availableHeightPx: number;
}

// Interface combining all widget actions, not all are needed for each action
interface IWidgetAction extends Redux.Action {
    type: string;
    id?: string;
    widgetType?: string;
    widgetSettings?: any;
    row?: number;
    col?: number;
    width?: number;
    height?: number;
    layouts?: Layout[]; // Layout from react-grid-view
    layout?: any; // from layout.js
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
        "settings": {
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
        "settings": {
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
        "settings": {
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
    settings: Prop.shape({
        name: Prop.string.isRequired
    }).isRequired
});

/* // TODO: better explicitly create initial state? But when? ...
 export function createInitialWidgets() {
 return function(dispatch: AppState.Dispatch) {
 dispatch(addWidget('chart', {
 "name": "Random Values",
 "datasource": "initial_random_source",
 "chartType": "area-spline",
 "dataKeys": "[\"value\"]",
 "xKey": "x",
 "names": "{\"value\": \"My Value\"}",
 "gaugeData": "{\"min\":0,\"max\":100,\"units\":\" %\"}"
 }, 0, 0, 6, 2));

 dispatch(addWidget('text', {
 "name": "Random data",
 "datasource": "initial_random_source"
 }, 0, 6, 6, 3));


 dispatch(addWidget('text', {
 "name": "Bars",
 "datasource": "initial_random_source",
 "chartType": "spline",
 "dataKeys": "[\"value\", \"value2\"]",
 "xKey": "x",
 "names": "{\"value\": \"My Value\"}",
 "gaugeData": "{\"min\":0,\"max\":100,\"units\":\" %\"}"
 }, 2, 0, 6, 2));
 }
 }
 */

export function createWidget(widgetType: string, widgetSettings: any): AppState.ThunkAction {
    return (dispatch: AppState.Dispatch, getState: AppState.GetState): any => {
        const widgets = getState().widgets;
        const widgetPositions = calcNewWidgetPosition(widgets);

        return dispatch(addWidget(widgetType, widgetSettings, widgetPositions.row, widgetPositions.col));
    }
}

export function addWidget(widgetType: string, widgetSettings: any = {}, row: number, col: number, width: number = 3, height: number = 3): IWidgetAction {
    return {
        type: Action.ADD_WIDGET,
        id: Uuid.generate(),
        col: col,
        row: row,
        width,
        height,
        widgetType,
        widgetSettings
    };
}

export function updateWidgetSettings(id: string, widgetSettings: any): IWidgetAction {
    return {
        type: Action.UPDATE_WIDGET_PROPS,
        id,
        widgetSettings
    }
}

export function deleteWidget(id: string): IWidgetAction {
    return {
        type: Action.DELETE_WIDGET,
        id
    }
}

export function updateLayout(layouts: Layout[]): IWidgetAction {
    return {
        type: Action.UPDATE_WIDGET_LAYOUT,
        layouts: layouts
    }
}

const widgetsCrudReducer: Function = <Function>genCrudReducer([Action.ADD_WIDGET, Action.DELETE_WIDGET], widget);
export function widgets(state: IWidgetsState = initialWidgets, action: IWidgetAction): IWidgetsState {
    state = widgetsCrudReducer(state, action);
    switch (action.type) {
        case Action.UPDATE_WIDGET_LAYOUT:
            return _.valuesIn<IWidgetState>(state)
                .reduce((newState, {id}) => {
                        newState[id] = widget(newState[id], action);
                        return newState;
                    }, _.assign<any, IWidgetsState>({}, state)
                );
        case Action.LOAD_LAYOUT:
            console.assert(action.layout.widgets, "Layout is missing Widgets, id: " + action.layout.id);
            return action.layout.widgets || {};
        case Action.DELETE_WIDGET_PLUGIN: // Also delete related widgets // TODO: Or maybe not when we render an empty box instead
            const toDelete = _.valuesIn<IWidgetState>(state).filter(widgetState => {
                return widgetState.type === action.id
            });
            const newState = _.assign<any, IWidgetsState>({}, state);
            toDelete.forEach(widgetState => {
                delete newState[widgetState.id];
            });

            return newState;
        default:
            return state;
    }
}

function calcAvaliableHeight(heightUnits: number): number {
    // The 10 px extra seem to be based on a bug in the grid layout ...
    return (heightUnits * (ROW_HEIGHT + 10)) - HEADER_HEIGHT;
}

function widget(state: IWidgetState, action: IWidgetAction): IWidgetState {
    switch (action.type) {
        case Action.ADD_WIDGET:
            return {
                id: action.id,
                type: action.widgetType,
                settings: action.widgetSettings,
                row: action.row,
                col: action.col,
                width: action.width,
                height: action.height,
                availableHeightPx: calcAvaliableHeight(action.height)
            };
        case Action.UPDATE_WIDGET_PROPS:
            return _.assign<any, IWidgetState>({}, state, {settings: action.widgetSettings});
        case Action.UPDATE_WIDGET_LAYOUT:
            const layout = layoutById(action.layouts, state.id);
            if (layout == null) {
                console.warn("No layout for widget. Skipping position update of widget with id: " + state.id);
                return state;
            }
            return _.assign<any, IWidgetState>({}, state, {
                row: layout.y,
                col: layout.x,
                width: layout.w,
                height: layout.h,
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

export function calcNewWidgetPosition(widgets: {[key: string]: IWidgetPosition}): {col: number, row: number} {
    let colHeights: any = {};
    // TODO: Replace 12 with constant for number of columns
    // This is different on different breaking points...
    for (let i = 0; i < 12; i++) {
        colHeights[i] = 0;
    }
    colHeights = _.valuesIn<IWidgetState>(widgets).reduce((prev, curr) => {
        prev[curr.col] = prev[curr.col] || 0;
        const currHeight = curr.row + curr.height || 0;
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
    return {col: col, row: Math.min(...heights)}
}