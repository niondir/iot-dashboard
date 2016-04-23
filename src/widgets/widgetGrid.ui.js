import * as React from 'react';
import * as Redux from 'redux';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as Widgets from './widgets'
import WidgetFrame from './widgetFrame.ui'
import * as WidgetConfig from './widgetConfig'
import WidgetPlugins from './widgetPlugins'
require('react-grid-layout/css/styles.css');
const Prop = React.PropTypes;

import {Responsive as ResponsiveReactGridLayout, WidthProvider}  from 'react-grid-layout';
const ResponsiveGrid = WidthProvider(ResponsiveReactGridLayout);


class WidgetGrid extends Component {

    onLayoutChange(layout) {
        if (this.props.onLayoutChange) {
            this.props.onLayoutChange(layout)
        }
    }

    render() {
        const props = this.props;
        let widgetData:Array<object> = this.props.widgets || [];
        // WidgetFrame must be loaded as function, else the grid is not working properly.
        // TODO: Remove unknown widget from state
        console.log("WidgetData: ", widgetData);
        let widgets = widgetData.map((data) => {
            let widget = WidgetPlugins.getPlugin(data.type);
            if (!widget) {
                console.warn("No WidgetPlugin for type '" + data.type + "'! Skipping rendering of that widget.");
                return null;
            }
            return WidgetFrame({widget: data, datasources: props.datasources})
        }).filter(frame => frame !== null);

        /* //Does NOT work that way:
         let widgets = widgetData.map((data) => <WidgetFrame {...data}
         key={data.id}
         _grid={{x: data.col, y: data.row, w: data.width, h: data.height}}
         />);*/
        return (
            <ResponsiveGrid className="column" cols={12} rowHeight={200}
                            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                            cols={{lg: 6, md: 6, sm: 6, xs: 4, xxs: 2}}
                            draggableCancel=".no-drag"
                            draggableHandle=".drag"
                            onLayoutChange={this.onLayoutChange.bind(this)}
            >
                {widgets}
            </ResponsiveGrid>
        )
    }
}

WidgetGrid.propTypes = {
    widgets: Prop.array.isRequired,
    datasources: Prop.object.isRequired,
    onLayoutChange: Prop.func
};

export default connect(
    (state) => {
        return {
            widgets: Object.keys(state.widgets).map(id => state.widgets[id]) || [],
            datasources: state.datasources || {}
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

