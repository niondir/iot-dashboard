import React from "react";
import * as Widgets from "./widgets";
import {connect} from "react-redux";
import * as WidgetConfig from './widgetConfig'
import _ from "lodash";
import * as ui from "../ui/elements.ui";
import {reset} from "redux-form";
const Prop = React.PropTypes;


const WidgetsNavItem = (props) => {

    return <div className="ui simple dropdown item">
        Add Widget
        <i className="dropdown icon"/>
        <div className="ui menu">

            <ui.Divider/>
            {
                _.valuesIn(props.plugins).filter(p => p.isWidget).map(widgetPlugin => {
                    return <AddWidget key={widgetPlugin.id} text={widgetPlugin.typeInfo.name} type={widgetPlugin.typeInfo.type}/>;
                })
            }
        </div>
    </div>;
};

export default connect(
    (state) => {
        return {
            plugins: state.plugins
        }
    }
)(WidgetsNavItem);

const AddWidget = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            onClick: (props) => {
                dispatch(WidgetConfig.createWidget(props.type))
            }
        }
    }
)(ui.LinkItem);