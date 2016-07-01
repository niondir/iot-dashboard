import * as React from "react";
import {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import * as Widgets from "./widgets";
import WidgetFrame from "./widgetFrame.ui";
import * as WidgetPlugins from "./widgetPlugins";
import WidthProvider from "./widthProvider.ui";
import {Responsive as ResponsiveReactGridLayout} from "react-grid-layout";
import {PropTypes as Prop}  from "react";
const ResponsiveGrid = WidthProvider(ResponsiveReactGridLayout);

require('react-grid-layout/css/styles.css');

const breakpoints =  {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0};
const cols =  {lg: 12, md: 12, sm: 12, xs: 6, xxs: 3};

class WidgetGrid extends Component {

    onLayoutChange(layout) {
        if (this.props.onLayoutChange) {
            this.props.onLayoutChange(layout)
        }
    }

    render() {
        const props = this.props;
        let widgetStates = this.props.widgets;

        // TODO: Remove unknown widget from state
        let widgets = widgetStates.map((widgetState) => {
            let widgetPlugin = props.widgetPlugins[widgetState.type];
            if (!widgetPlugin) {
                console.warn("No WidgetPlugin for type '" + widgetState.type + "'! Skipping rendering.");
                return null;
            }
            // WidgetFrame must be loaded as function, else the grid is not working properly.
            return WidgetFrame({widget: widgetState, widgetPlugin: widgetPlugin, isReadOnly: props.isReadOnly})
        }).filter(frame => frame !== null);

        /* //Does NOT work that way:
         let widgets = widgetData.map((data) => <WidgetFrame {...data}
         key={data.id}
         _grid={{x: data.col, y: data.row, w: data.width, h: data.height}}
         />);*/
        return (
            <ResponsiveGrid className="column" rowHeight={Widgets.ROW_HEIGHT}
                            breakpoints={breakpoints}
                            cols={cols}
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
    widgetPlugins: Prop.object.isRequired,
    onLayoutChange: Prop.func,
    deleteWidget: Prop.func,
    isReadOnly: Prop.bool.isRequired
};

export default connect(
    (state) => {
        return {
            widgets: _.valuesIn(state.widgets) || [],
            datasources: state.datasources || {},
            widgetPlugins: state.widgetPlugins || {},
            isReadOnly: state.dashboard.isReadOnly
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

