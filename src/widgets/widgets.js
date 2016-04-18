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

const widgetsCrudReducer = genCrudReducer([ADD_WIDGET, UPDATE_WIDGET_PROPS, DELETE_WIDGET], widget);
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


/**
 * The Dragable Frame of a Widget.
 * Contains generic UI controls, shared by all Widgets
 */
export const WidgetFrame = (widgetState) => {
    let widget = WidgetPlugins.getWidget(widgetState.type);
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
                {React.createElement(widget.widget, {...widgetState.props, _state: widgetState})}
            </div>
        </div>)
};

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