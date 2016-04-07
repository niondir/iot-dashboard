import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as WidgetGrid from './widgetGrid'

export class NavAction extends Component {
    render() {
        return <a className="item" href="#" onClick={() => {console.log("adding widget");this.props.onClick()}}>{this.props.title}</a>;

    }
}


const mapStateToProps = (state) => {
    return {
    }
};

export const AddWidget = connect(
    mapStateToProps,
    (dispatch) => {
        return {
            onClick: () => {
                dispatch(WidgetGrid.addWidget())
            }
        }
    }
)(NavAction);
