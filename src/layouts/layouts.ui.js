import React from 'react';
import {connect} from 'react-redux'
import {valuesOf} from '../util/collection'
import * as Layouts from './layouts'
import * as ui from '../uiElements'
const Prop = React.PropTypes;


/*TODO: Add remove button next to each loadable layout
 * - Connect with Actions
 * */
const TopNavItem = (props) => {
    return <div className="ui simple dropdown item">
        Layout
        <i className="dropdown icon"/>
        <div className="ui menu">
            <SaveLayout/>
            <ResetLayoutButton text="Reset Current Layout" icon="undo"/>
            <div className="ui divider"></div>
            <div className="header">Load Layout</div>

            {props.layouts.map(layout => {
                return <LayoutItem text={layout.name} icon="plus" layout={layout}
                                   key={layout.id}/>
            })}

        </div>
    </div>
};

TopNavItem.propTypes = {
    addLayout: Prop.func,
    deleteLayout: Prop.func,
    widgets: Prop.object,
    layouts: Prop.arrayOf(
        Prop.shape({
            name: Prop.string
        })
    )
};

const TopNavItemContainer = connect((state) => {
        return {
            layouts: valuesOf(state.layouts)
        }
    },
    (dispatch)=> {
        return {
            addLayout: (name) => Layouts.addLayout(name, state.widgets)
        }
    })(TopNavItem);

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
            layouts: valuesOf(state.layouts),
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
            <i className="right floated remove huge icon" style={{zIndex:9000}} onClick={(e) => {
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
            currentLayout: state.currentLayout,
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
            id: state.currentLayout.id
        }
    },
    (dispatch, props)=> {
        return {
            onClick: (props) => dispatch(Layouts.loadLayout(props.id))
        }
    }
)(ui.LinkItem);

export {TopNavItemContainer as TopNavItem}


