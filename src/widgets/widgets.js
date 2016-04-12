import * as React from 'react';
import * as TimeWidget from './timeWidget'
import * as TextWidget from './textWidget'
import {connect} from 'react-redux'
import * as Uuid from '../util/uuid'
import * as WidgetConfig from './widgetConfig'
import {valuesOf} from '../util/collection'
import {genCrudReducer} from '../util/reducer'

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

const ADD_WIDGET = "ADD_WIDGET";
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

const UPDATE_WIDGET_PROPS = "UPDATE_WIDGET_PROPS";
export function updateWidgetProps(id, widgetProps = {}) {
    return {
        type: UPDATE_WIDGET_PROPS,
        id,
        widgetProps
    }
}

const DELETE_WIDGET = "DELETE_WIDGET";
export function deleteWidget(id) {
    return {
        type: DELETE_WIDGET,
        id
    }
}


const UPDATE_LAYOUT = "UPDATE_WIDGET_LAYOUT";
export function updateLayout(layout) {
    return {
        type: UPDATE_LAYOUT,
        layout
    }
}

const widgetsCrudReducer = genCrudReducer([ADD_WIDGET, UPDATE_WIDGET_PROPS, DELETE_WIDGET], widget, initialWidgets);
export function widgets(state = initialWidgets, action) {
    state = widgetsCrudReducer(state, action);
    let newState;
    switch (action.type) {
        case UPDATE_LAYOUT:
            return valuesOf(state)
                .reduce((newState, {id}) => {
                        newState[id] = widget(newState[id], action);
                        return newState;
                    }, {...state}
                );
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
        case UPDATE_LAYOUT:
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

// TODO: Move to widgetRegistry module or own class
export function register(module) {
    console.assert(module.TYPE_INFO, "Missing TYPE_INFO on widget module. Every module must export TYPE_INFO");
    widgets[module.TYPE_INFO.type] = {
        ...module.TYPE_INFO,
        widget: module.Widget,
        configDialog: module.ConfigDialog ? module.ConfigDialog : null
    }
}

export function getWidget(type:String) {
    return widgets[type];
}

export function getWidgets():Array {
    return Object.keys(widgets).map(key => widgets[key]);
}

// End Widget Registry


/**
 * The Dragable Frame of a Widget.
 * Contains generic UI controls, shared by all Widgets
 */
export function WidgetFrame(widgetState) {
    let widget = getWidget(widgetState.type);
    console.assert(widget, "No registered widget with type: " + widgetState.type);
    return (
        <div className="ui raised segments"
             style={{margin: 0}}
             key={widgetState.id}
             _grid={{x: widgetState.col, y: widgetState.row, w: widgetState.width, h: widgetState.height}}>

            <div className="ui inverted segment">
                <div className="ui tiny horizontal right floated inverted list">
                    <ConfigWidgetButton className="right item" widgetState={widgetState}
                                        visible={(widget.configDialog ? true : false)} icon="configure"/>
                    <a className="right item drag">
                        <i className="move icon drag"></i>
                    </a>
                    <DeleteWidgetButton className="right floated item" widgetState={widgetState} icon="remove"/>
                </div>
                <div className="ui item top attached">{widgetState.props.name || "\u00a0"}</div>
            </div>

            <div className="ui segment">
                {React.createElement(widget.widget, widgetState.props)}
            </div>
        </div>)
}

class WidgetButton extends React.Component {
    render() {
        let data = this.props.widgetState;
        return <a className={this.props.className + (this.props.visible !== false ? "" : " hidden transition")}
                  onClick={() => this.props.onClick(data)}>
            <i className={this.props.icon + " icon"}></i>
        </a>
    }
}

export let DeleteWidgetButton = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            onClick: (widgetState) => {
                dispatch(deleteWidget(widgetState.id))
            }
        };
    }
)(WidgetButton);

export let ConfigWidgetButton = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            onClick: (widgetState) => {
                dispatch(WidgetConfig.openWidgetConfigDialog(widgetState.id))
            }
        };
    }
)(WidgetButton);

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