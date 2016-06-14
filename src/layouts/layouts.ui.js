import React from 'react';
import {connect} from 'react-redux'
import _ from 'lodash'
import * as Layouts from './layouts'
import * as ui from '../ui/elements.ui'
import {PropTypes as Prop}  from "react";


/*TODO: Add remove button next to each loadable layout
 * - Connect with Actions
 * */
const LayoutsTopNavItem = (props) => {
    return <div className="ui simple dropdown item">
        Layout
        <i className="dropdown icon"/>
        <div className="ui menu">
            <SaveLayout/>
            <ResetLayoutButton text="Reset Current Layout" icon="undo"/>
            <SaveLayoutButton text="Save Layout" icon="save"/>
            <div className="ui divider"></div>
            <div className="header">Load Layout</div>

            {props.layouts.map(layout => {
                return <LayoutItem text={layout.name} icon="plus" layout={layout}
                                   key={layout.id}/>
            })}

        </div>
    </div>
};

LayoutsTopNavItem.propTypes = {
    layouts: Prop.arrayOf(
        Prop.shape({
            name: Prop.string
        })
    ),
    widgets: Prop.object,
    currentLayout: Prop.object
};

export default connect((state) => {
        return {
            layouts: _.valuesIn(state.layouts),
            currentLayout: state.currentLayout,
            widgets: state.widgets
        }
    },
    (dispatch)=> {
        return {
        }
    })(LayoutsTopNavItem);

class SaveInput extends React.Component {
    onEnter(e) {
        if (e.key === 'Enter') {
            this.props.onEnter(this.refs.input.value, this.props);
            this.refs.input.value = '';
        }
    }

    render() {
        return <div className="item">
            <div className="ui icon input">
                <input type="text" placeholder="Save as..." ref="input" onKeyPress={this.onEnter.bind(this)}/>
                <i className="save icon" onClick={this.onEnter.bind(this)} style={{cursor:"pointer", zIndex:90000}}/>
            </div>
        </div>
    }
}

SaveInput.propTypes = {
    onEnter: Prop.func,
    widgets: Prop.object
};

const SaveLayout = connect((state) => {
        return {
            layouts: _.valuesIn(state.layouts),
            widgets: state.widgets
        }
    },
    (dispatch, props)=> {
        return {
            onEnter: (name, props) => {
                dispatch(Layouts.addLayout(name, props.widgets))
            }
        }
    },
    (stateProps, dispatchProps, ownProps)=> {
        return {...ownProps, ...stateProps, ...dispatchProps}
    }
)(SaveInput);

class MyLayoutItem extends React.Component {
    render() {
        let props = this.props;

        let indexIconClass = null;
        if (props.currentLayout.id == props.layout.id) {
            indexIconClass = "tiny selected radio icon";
        }
        else {
            indexIconClass = "tiny radio icon";
        }

        return <a className="item" href="#" onClick={() => props.onClick(props)}>
            <i className={indexIconClass}/>
            <i className="right floated remove huge icon" onClick={(e) => {
            props.deleteLayout(props);
            e.stopPropagation();
            }}/> {props.text}
        </a>;
    }
}

MyLayoutItem.propTypes = {
    deleteLayout: Prop.func.isRequired,
    onClick: Prop.func.isRequired,
    layout: Prop.object.isRequired,
    currentLayout: Prop.object
};

const LayoutItem = connect(
    (state) => {
        return {
            currentLayout: state.currentLayout
        }
    },
    (dispatch, props)=> {
        return {
            deleteLayout: (props) => dispatch(Layouts.deleteLayout(props.layout.id)),
            onClick: (props) => dispatch(Layouts.loadLayout(props.layout.id))
        }
    }
)(MyLayoutItem);

/*
 const ResetLayoutButtonc = (props) => {
 return <ui.LinkItem
 onClick={this.props.resetLayout.bind(this, this.props)}></ui.LinkItem>
 };*/


const ResetLayoutButton = connect(
    (state) => {
        return {
            id: state.currentLayout.id,
            disabled: !state.currentLayout.id
        }
    },
    (dispatch, props)=> {
        return {
            onClick: (props) => dispatch(Layouts.loadLayout(props.id))
        }
    }
)(ui.LinkItem);

const SaveLayoutButton = connect(
    (state) => {
        return {
            id: state.currentLayout.id,
            widgets: state.widgets,
            disabled: !state.currentLayout.id
        }
    },
    (dispatch)=> {
        return {
            onClick: (props) => dispatch(Layouts.updateLayout(props.id, props.widgets))
        }
    }
)(ui.LinkItem);

