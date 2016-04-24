import * as React from 'react';
import {connect} from 'react-redux'
import * as WidgetConfig from './widgetConfig'
import WidgetPlugins from './widgetPlugins'
import {deleteWidget} from './widgets'
import DatasourcePlugins from '../datasource/datasourcePlugins'
const Prop = React.PropTypes;

/**
 * The Dragable Frame of a Widget.
 * Contains generic UI controls, shared by all Widgets
 */
const WidgetFrame = (props) => {
    const widgetState = props.widget;

    let widgetPlugin = WidgetPlugins.getPlugin(widgetState.type);
    console.assert(widgetPlugin, "No registered widget with type: " + widgetState.type);

    const dataResolver = (id) => {
        const ds = props.datasources[id];
        if (!ds) {
            //console.warn("Can not find Datasource with id " + id + " for widget: ", widgetState, " Returning empty data!");
            return [];
        }

        return ds.data ? [...ds.data] : [];
    };

    return (
        <div className="ui raised segments"
             style={{margin: 0}}
             key={widgetState.id}
             _grid={{x: widgetState.col, y: widgetState.row, w: widgetState.width, h: widgetState.height}}>

            <div className="ui inverted segment">
                <div className="ui tiny horizontal right floated inverted list">
                    <ConfigWidgetButton className="right item" widgetState={widgetState}
                                        visible={(widgetPlugin.settings ? true : false)} icon="configure"/>
                    <a className="right item drag">
                        <i className="move icon drag"></i>
                    </a>
                    <DeleteWidgetButton className="right floated item" widgetState={widgetState} icon="remove"/>
                </div>
                <div className="ui item top attached">{widgetState.props.name || "\u00a0"}</div>
            </div>

            <div className="ui segment">
                {widgetPlugin.getOrCreateWidget(widgetState.id)}
                {/*React.createElement(widgetPlugin.Widget, {
                    config: widgetState.props,
                    _state: widgetState,
                    getData: dataResolver
                })*/}
            </div>
        </div>)
};


export default WidgetFrame;

class WidgetButton extends React.Component {
    render() {
        let data = this.props.widgetState;
        return <a className={this.props.className + (this.props.visible !== false ? "" : " hidden transition")}
                  onClick={() => this.props.onClick(data)}>
            <i className={this.props.icon + " icon"}></i>
        </a>
    }
}

let DeleteWidgetButton = connect(
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

let ConfigWidgetButton = connect(
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