import * as React from 'react';
import * as TimeWidget from './timeWidget'
import * as TextWidget from './textWidget'
import {connect} from 'react-redux'
import * as Uuid from '../util/uuid'

let initialWidgets = {
    "initial_widget": {
        type: "time",
        id: "initial_widget",
        row: 0,
        col: 0,
        width: 1,
        height: 1
        // TODO: Get some customProps for arbitrary widget state
    }
};

const ADD_WIDGET = "ADD_WIDGET";
export function addWidget(type, props = {}, width = 1, height = 1) {
    return {
        type: ADD_WIDGET,
        width: width,
        height: height,
        widgetType: type,
        widgetProps: props
    }
}


const UPDATE_WIDGET_PROPS = "UPDATE_WIDGET_PROPS";
export function updateWidgetProps(id, props = {}) {
    return {
        type: ADD_WIDGET,
        width: width,
        height: height,
        widgetType: type,
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

export function widgets(state = initialWidgets, action) {
    switch (action.type) {
        case ADD_WIDGET:
            action.col = findSmalestCol(state);
            return [
                ...state,
                widget(undefined, action)
            ];
        case UPDATE_WIDGET_PROPS:
        {
            return state;
        }
        case DELETE_WIDGET:
            return state.filter(w => w.id !== action.id);
        case UPDATE_LAYOUT:
            // TODO: Maybe just store the layout somewhere else? Is it possible?
            return Object.keys(state).map(id => state[id])
                .map((widget) => {
                    let layout = layoutById(action.layout, widget.id);
                    return {
                        ...widget,
                        row: layout.y,
                        col: layout.x,
                        width: layout.w,
                        height: layout.h
                    }
                });
        default:
            return state;
    }
}

function widget(state = {}, action) {
    switch (action.type) {
        case ADD_WIDGET:
            return {
                id: Uuid.generate(),
                type: action.widgetType,
                props: action.widgetProps,
                row: Infinity,
                col: action.col,
                width: action.width,
                height: action.height
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
    widgets[module.TYPE] = {
        widget: module.Widget,
        configDialog: module.ConfigDialog

    };
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

                <div className="content">
                    <div className="header item"><span className="">{widgetState.id}</span></div>
                </div>
                <div className="right menu">
                    <a className="item drag">
                        <i className="move icon drag"></i>
                    </a>
                    <DeleteWidgetButton data={widgetState}/>
                </div>
            </div>

            <div className="ui segment">
                {React.createElement(widget.widget, widgetState.props)}
            </div>
        </div>)
}

class RemoveButton extends React.Component {
    render() {
        let data = this.props.data;
        return <a className="item no-drag"
                  onClick={() => this.props.onClick(data.id)}>
            <i className="remove icon no-drag"></i>
        </a>
    }
}

let DeleteWidgetButton = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            onClick: (id) => {
                dispatch(Widgets.deleteWidget(id))
            }
        };
    }
)(RemoveButton);

// Local functions

function layoutById(layout:Array, id) {
    return layout.find((l) => {
        return l.i === id;
    })
}

function findSmalestCol(widgets:Array) {
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