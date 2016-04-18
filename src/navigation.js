import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as WidgetConfig from './widgets/widgetConfig'
import {LinkItem} from './ui/elements.ui'



const mapStateToProps = (state) => {
    return {}
};

export const AddWidget = connect(
    mapStateToProps,
    (dispatch) => {
        return {
            onClick: (props) => {
                dispatch(WidgetConfig.createWidget(props.type, {text: "My Text component " + (Math.random() * 1000).toFixed()}))
            }
        }
    }
)(LinkItem);
