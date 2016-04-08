import * as React from 'react';
import * as Redux from 'redux';
import * as Uuid from './util/uuid'
import {Component} from 'react';
import {connect} from 'react-redux'
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
require('react-grid-layout/css/styles.css');

import {Responsive as ResponsiveReactGridLayout, WidthProvider}  from 'react-grid-layout';
const ResponsiveGrid = WidthProvider(ResponsiveReactGridLayout);

const initialState = {
    widgets: [
        {
            type: "time",
            id: "Initial Widget with way more text",
            row: 0,
            col: 0,
            width: 1,
            height: 1
            // TODO: Get some customProps for arbitrary widget state
        }
    ]
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

const DELETE_WIDGET = "DELETE_WIDGET";
export function deleteWidget(id) {
    return {
        type: DELETE_WIDGET,
        id: id
    }
}

const UPDATE_LAYOUT = "UPDATE_LAYOUT";
function updateLayout(layout) {
    return {
        type: UPDATE_LAYOUT,
        layout: layout
    }
}

const widget = (state = {}, action) => {
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
};



export const widgets = (state = initialState.widgets, action) => {
    switch (action.type) {
        case ADD_WIDGET:
            action.col = findLowestCol(state);
            return [
                ...state,
                widget(undefined, action)
            ];
        case DELETE_WIDGET:
            return state.filter(w => w.id !== action.id);
        case UPDATE_LAYOUT:
            return state.map((widget) => {
                let layout = layoutForWidget(action.layout, widget);
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
};

export var reducer = Redux.combineReducers({
    widgets
});


class RemoveButton extends Component {
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
                dispatch(deleteWidget(id))
            }
        };
    }
)(RemoveButton);

/**
 * The Dragable Frame of a Widget.
 * Contains generic UI controls, shared by all Widgets
 */
const WidgetFrame = (widgetState) => {
    let widget = Widgets.getWidget(widgetState.type);
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
};

class WidgetGrid extends Component {

    render() {
        let widgetData:Array<object> = this.props.widgets || [];
        let widgets = widgetData.map((data) => WidgetFrame(data));

        return (
            <ResponsiveGrid className="column" cols={12} rowHeight={200}
                            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                            cols={{lg: 6, md: 6, sm: 6, xs: 4, xxs: 2}}
                            draggableCancel=".no-drag"
                            draggableHandle=".drag"
                            onLayoutChange={(layout) => { if (this.props.onLayoutChange) this.props.onLayoutChange(layout)}}
            >
                {widgets}
            </ResponsiveGrid>
        )
    }
}

const WidgetGridContainer = connect(
    (state) => {
        return {
            widgets: state.widgetGrid.widgets
        }
    },
    (dispatch) => {
        return {
            onLayoutChange: (layout) => {
                dispatch(updateLayout(layout))
            }
        };
    }
)(WidgetGrid);
export {WidgetGridContainer as WidgetGrid};

function findLowestCol(widgets:Array) {
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

function layoutForWidget(layout:Array, widget) {
    return layout.find((l) => {
        return l.i === widget.id;
    })
}
