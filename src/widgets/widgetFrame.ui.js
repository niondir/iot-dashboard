/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import {connect} from 'react-redux'
import * as WidgetConfig from './widgetConfig'
import * as WidgetPlugins from './widgetPlugins'
import {deleteWidget} from './widgets'
import * as Widgets from './widgets'
import {PropTypes as Prop}  from "react";
import Dashboard from '../dashboard'

/**
 * The Dragable Frame of a Widget.
 * Contains generic UI controls, shared by all Widgets
 */
const WidgetFrame = (props) => {
    const widgetState = props.widget;

    // Might be null or undefined!
    const widgetFactory = Dashboard.getInstance().widgetPluginRegistry.getPlugin(widgetState.type);

    return (
        <div className="ui raised segments"
             style={{margin: 0, overflow: "hidden"}}
             key={widgetState.id}
             _grid={{x: widgetState.col, y: widgetState.row, w: widgetState.width, h: widgetState.height}}>

            <div className={"ui inverted segment" + (props.isReadOnly ? "" : " drag")}>
                {props.isReadOnly ? null :
                    <div className="ui tiny horizontal right floated inverted list">

                        <ConfigWidgetButton className="right item no-drag" widgetState={widgetState}
                                            visible={(props.widgetPlugin && props.widgetPlugin.typeInfo.settings ? true : false)}
                                            icon="configure"/>
                        {/* <!--<a className="right item drag">
                         <i className="move icon drag"></i>
                         </a>*/}
                        <DeleteWidgetButton className="right floated item no-drag" widgetState={widgetState}
                                            icon="remove"/>


                    </div>
                }
                <div className={"ui item top attached" + (props.isReadOnly ? "" : " drag")}>
                    {widgetState.settings.name || "\u00a0"}
                </div>
            </div>

            <div className="ui segment"
                 style={{height: widgetState.availableHeightPx, padding:0, border: "red dashed 0px"}}>
                {
                    widgetFactory ?
                        widgetFactory.getOrCreateInstance(widgetState.id)
                        :
                        <LoadingWidget widget={widgetState}/>
                }
            </div>
        </div>)
};

WidgetFrame.propTypes = {
    widget: Widgets.widgetPropType.isRequired,
    widgetPlugin: WidgetPlugins.widgetPluginType.isRequired,
    isReadOnly: Prop.bool.isRequired
};


export default WidgetFrame;

const LoadingWidget = (props) => {
    return <div className="ui active text loader">Loading {props.widget.type} Widget ...</div>
};

LoadingWidget.propTypes = {
    widget: Widgets.widgetPropType.isRequired
};

class WidgetButton extends React.Component {
    render() {
        const data = this.props.widgetState;
        return <a className={this.props.className + (this.props.visible !== false ? "" : " hidden transition")}
                  onClick={() => this.props.onClick(data)}>
            <i className={this.props.icon + " icon"}></i>
        </a>
    }
}

WidgetButton.propTypes = {
    widgetState: Widgets.widgetPropType.isRequired,
    icon: Prop.string.isRequired,
    visible: Prop.bool,
    className: Prop.string.isRequired,
    onClick: Prop.func.isRequired
};

const DeleteWidgetButton = connect(
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

const ConfigWidgetButton = connect(
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