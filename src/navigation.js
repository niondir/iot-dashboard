import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as WidgetGrid from './widgetGrid'

export class LinkItem extends Component {
   
    render() {
        let icon = undefined;
        if (this.props.icon) {
            icon = <i className={this.props.icon +" icon"}></i>;
        }
        
        return <div><a className="item" href="#" onClick={() => this.props.onClick(this)}>{icon}{this.props.title}</a></div>;

    }
}


const mapStateToProps = (state) => {
    return {}
};

export const AddWidget = connect(
    mapStateToProps,
    (dispatch) => {
        return {
            onClick: (linkItem) => {
                // Todo get widget props from modal dialog
                dispatch(WidgetGrid.addWidget(linkItem.props.type, {text: "My Text component " + (Math.random() * 1000).toFixed()}))
            }
        }
    }
)(LinkItem);
