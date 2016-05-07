import * as React from "react";
import {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import * as Widgets from "./widgets";
import WidgetFrame from "./widgetFrame.ui";
import WidgetPlugins from "./widgetPlugins";
import WidthProvider from "./widthProvider.ui";
import {Responsive as ResponsiveReactGridLayout} from "react-grid-layout";
const Prop = React.PropTypes;
const ResponsiveGrid = WidthProvider(ResponsiveReactGridLayout);

require('react-grid-layout/css/styles.css');

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
        let widgets = widgetData.map((data) => {
            let widget = WidgetPlugins.getPlugin(data.type);
            if (!widget) {
                console.warn("No WidgetPlugin for type '" + data.type + "'! Skipping rendering.");
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
                            style={{padding: "20px"}}
            >
                {widgets}
            </ResponsiveGrid>
        )
    }
}

WidgetGrid.propTypes = {
    widgets: Prop.array.isRequired,
    datasources: Prop.object.isRequired,
    onLayoutChange: Prop.func,
    deleteWidget: Prop.func
};

export default connect(
    (state) => {
        return {
            widgets: _.valuesIn(state.widgets) || [],
            datasources: state.datasources || {}
        }
    },
    (dispatch) => {
        return {
            onLayoutChange: (layout) => {
                dispatch(Widgets.updateLayout(layout))
            },
            deleteWidget: (id) => dispatch(Widgets.deleteWidget(id))
        };
    }
)(WidgetGrid);

