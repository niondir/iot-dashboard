import * as React from 'react';
import * as Redux from 'redux';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
require('react-grid-layout/css/styles.css');

import {Responsive as ResponsiveReactGridLayout, WidthProvider}  from 'react-grid-layout';
const ResponsiveGrid = WidthProvider(ResponsiveReactGridLayout);


class WidgetGrid extends Component {

    render() {
        let widgetData:Array<object> = this.props.widgets || [];
        let widgets = widgetData.map((data) => Widgets.WidgetFrame(data));

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
            widgets: Object.keys(state.widgets).map(id => state.widgets[id]) ||[]
        }
    },
    (dispatch) => {
        return {
            onLayoutChange: (layout) => {
                dispatch(Widgets.updateLayout(layout))
            }
        };
    }
)(WidgetGrid);
export {WidgetGridContainer as WidgetGrid};


