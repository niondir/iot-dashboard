import * as React from 'react';
import * as TimeWidget from './timeWidget'
import * as TextWidget from './textWidget'
import {connect} from 'react-redux'
import * as Uuid from '../util/uuid'
import * as WidgetConfig from './widgetConfig'

let initialWidgets = {
    "initial_time_widget": {
        type: "text",
        id: "initial_time_widget",
        row: 0,
        col: 0,
        width: 1,
        height: 1,
        props: {}
    },
    "initial_text_widget": {
        type: "text",
        id: "initial_text_widget",
        row: 0,
        col: 1,
        width: 1,
        height: 1,
        props: {text: "This is a text widget"}
    }
};

const ADD_WIDGET = "ADD_WIDGET";
export function addWidget(type, props = {}, width = 1, height = 1) {
    return {
        type: ADD_WIDGET,
        id: Uuid.generate(),
        width: width,
        height: height,
        widgetType: type,
        widgetProps: props
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
export function updateWidgetProps(id, props = {}) {
    return {
        type: UPDATE_WIDGET_PROPS,
        id: id,
        widgetProps: props
    }
}

const DELETE_WIDGET = "DELETE_WIDGET";
export function deleteWidget(id) {
    return {
        type: DELETE_WIDGET,
        id: id
    }
}


const UPDATE_LAYOUT = "UPDATE_LAYOUT";
export function updateLayout(layout) {
    return {
        type: UPDATE_LAYOUT,
        layout: layout
    }
}


function objAsList(obj) {
    return Object.keys(obj).map(key => obj[key])
}
export function widgets(state = initialWidgets, action) {
    let newState;
    switch (action.type) {
        case ADD_WIDGET:
            action.col = findSmallestCol(objAsList(state));
            newState = {...state};
            newState[action.id] = widget(undefined, action);
            return newState;
        case UPDATE_WIDGET_PROPS:
        {
            return widget(state[action.id]);
        }
        case DELETE_WIDGET:
            newState = {...state};
            return delete newState[action.id];
        case UPDATE_LAYOUT:
            // TODO: Maybe just store the layout somewhere else? Is it possible?
            newState = {...state};
            for (let id in state) {
                let layout = layoutById(action.layout, id);
                newState[id] = {
                    ...newState[id],
                    row: layout.y,
                    col: layout.x,
                    width: layout.w,
                    height: layout.h
                }
            }
            return newState;
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
                props: action.widgetProps,
                row: Infinity,
                col: action.col,
                width: action.width,
                height: action.height
            };
        case UPDATE_WIDGET_PROPS:
            return {
                ...state,
                props: action.widgetProps
            };
        default:
            return state;
    }
}

// TODO: Move to widgetRegistry module or own class
export function init() {
    register(TimeWidget);
    register(TextWidget);
}

export function register(module) {
    console.assert(module.TYPE_INFO, "Missing TYPE_INFO on widget module. Every module must export TYPE_INFO");
    widgets[module.TYPE_INFO.type] = {
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
    return (
        <div className="ui raised segments"
             style={{margin: 0}}
             key={widgetState.id}
             _grid={{x: widgetState.col, y: widgetState.row, w: widgetState.width, h: widgetState.height}}>


            <div className="ui small top attached inverted borderless icon menu">
                <div className="header item"><span className="">{widgetState.id}</span></div>
                <div className="right menu">
                    <ConfigWidgetButton widgetState={widgetState} icon="configure"/>
                    <a className="item drag">
                        <i className="move icon drag"></i>
                    </a>
                    <DeleteWidgetButton widgetState={widgetState} icon="remove"/>
                </div>
            </div>

            <div className="ui segment">
                {React.createElement(widget.widget, widgetState.props)}
            </div>
        </div>)
}

class WidgetButton extends React.Component {
    render() {
        let data = this.props.widgetState;
        return <a className="item"
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

function findSmallestCol(widgets:Array) {
    let colHeights = {};
    for (let i = 0; i < 6; i++) {
        colHeights[i] = 0;
    }
    colHeights = widgets.reduce((prev, curr) => {
        prev[curr.col] = prev[curr.col] || 0;
        let currHeight = curr.row + curr.height || 0;
        if (prev[curr.col] < currHeight) {
            for (let i = curr.col; i < curr.col + curr.width; i++) {
                prev[i] = currHeight;
            }
        }
        return prev;
    }, colHeights);

    return Object.keys(colHeights).reduce(function (a, b) {
        return Number(colHeights[a] <= colHeights[b] ? a : b);
    });
}