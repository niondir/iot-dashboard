import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as SemUtil from './semanticUiUtil'
import $ from 'jquery'
require('react-grid-layout/css/styles.css');
//require('react-resizable/css/styles.css');

import {Responsive as ResponsiveReactGridLayout, WidthProvider}  from 'react-grid-layout';
const ResponsiveGrid = WidthProvider(ResponsiveReactGridLayout);
//initGridster();


class WidgetGrid extends Component {
    render() {
        let widgetData:Array<object> = this.props.widgets;
        let key = 1;
        let row = 0;
        let col = 0;
        let widgets = widgetData.map((data) => {
            return <div className="ui raised segment" style={{margin: 0}} key={key++} name={key} _grid={{x: col++, y: row, w: 1, h: 3}}><WidgetContent name={key-1}/></div>;
        });

        return (
            <ResponsiveGrid className="column" cols={12} rowHeight={30}
                                       breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                                       cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            >
                {widgets}
            </ResponsiveGrid>
        )
    }

    renderEx() {
        let widgetData:Array<object> = this.props.widgets;
        let row = 1;
        let col = 1;
        let widgets = widgetData.map((data) => {
            return <Widget width={data} row={row} col={col++}/>;
        });

        return <div className="gridster">
            <div>
                {widgets}
            </div>
        </div>;

    }
}


const mapStateToProps = (state) => {
    return {
        value: state.widgets
    }
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

let WidgetGridContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WidgetGrid);

/* className={SemUtil.numberToClass(this.props.width) + " wide column" */
class WidgetContent extends Component {
    render() {
        return <div>
            Widget {this.props.name}</div>

    }
}


export { WidgetGridContainer as WidgetGrid };
