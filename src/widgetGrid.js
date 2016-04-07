import * as React from 'react';
import * as Redux from 'redux';
import * as Uuid from './util/uuid'
import {Component} from 'react';
import {connect} from 'react-redux'
import * as SemUtil from './semanticUiUtil'
import $ from 'jquery'
require('react-grid-layout/css/styles.css');
//require('react-resizable/css/styles.css');

import {Responsive as ResponsiveReactGridLayout, WidthProvider}  from 'react-grid-layout';
const ResponsiveGrid = WidthProvider(ResponsiveReactGridLayout);

const colsLg = 6;

const initialState = {
    widgets: [
        {
            id: "Initial Widget",
            row: 0,
            col: 0,
            width: 1,
            height: 1
        }
    ]
};

const ADD_WIDGET = "ADD_WIDGET";
export function addWidget(width = 1, height = 1) {
    return {
        type: ADD_WIDGET,
        width: width,
        height: height
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
                row: Infinity,
                col: action.col,
                width: action.width,
                height: action.height
            };
        default:
            return state;
    }
};

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

export const widgets = (state = initialState.widgets, action) => {
    switch (action.type) {
        case ADD_WIDGET:
            action.col = findLowestCol(state);
            return [
                ...state,
                widget(undefined, action)
            ];
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


class WidgetGrid extends Component {
    onLayoutChange(layout) {
        console.log("Layout:" + JSON.stringify(layout));
    }

    render() {
        let widgetData:Array<object> = this.props.widgets || [];
        let widgets = widgetData.map((data) => {
            return <div className="ui raised segment"
                        style={{margin: 0}}
                        key={data.id}
                        _grid={{x: data.col, y: data.row, w: data.width, h: data.height}}>
                <WidgetContent content={data.id}/>
            </div>;
        });

        return (
            <ResponsiveGrid className="column" cols={12} rowHeight={200}
                            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                            cols={{lg: 6, md: 6, sm: 6, xs: 4, xxs: 2}}
                            onLayoutChange={(layout) => { if (this.props.onLayoutChange) this.props.onLayoutChange(layout)}}
            >
                {widgets}
            </ResponsiveGrid>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        widgets: state.widgetGrid.widgets
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLayoutChange: (layout) => {
            dispatch(updateLayout(layout))
        }
    };
};

let WidgetGridContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WidgetGrid);

/* className={SemUtil.numberToClass(this.props.width) + " wide column" */
class WidgetContent extends Component {
    render() {
        return <div>
            {this.props.content}
        </div>

    }
}


export { WidgetGridContainer as WidgetGrid };
