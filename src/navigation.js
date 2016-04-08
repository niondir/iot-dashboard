import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux'
import * as WidgetGrid from './widgetGrid'
import * as WidgetConfig from './widgets/widgetConfig'

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
                dispatch(WidgetConfig.createWidget(linkItem.props.type, {text: "My Text component " + (Math.random() * 1000).toFixed()}))
            }
        }
    }
)(LinkItem);
