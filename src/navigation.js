import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as WidgetGrid from './widgetGrid'
import * as WidgetConfig from './widgets/widgetConfig'

export const LinkItem = (props) => {
    let icon;
    if (props.icon) {
        icon = <i className={props.icon +" icon"}></i>;
    }

    return <div>
        <a className="item" href="#" onClick={() => props.onClick(props)}>{icon}{props.title}</a>
    </div>;
};


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
