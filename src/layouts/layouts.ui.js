import React from 'react';
import {connect} from 'react-redux'
import {valuesOf} from '../util/collection'
import * as Layouts from './layouts'

const Prop = React.PropTypes;


/*TODO: Add remove button next to each loadable layout
 * - Connect with Actions
 * */
const TopNavItem = (props) => {
    return <div className="ui simple dropdown item">
        Layout
        <i className="dropdown icon"></i>
        <div className="menu">
            <SaveLayout/>
            <a className="item"><i className="undo icon"></i> Reset</a>
            <div className="ui divider"></div>
            <div className="header">Load Layout</div>
            {props.layouts.map(layout => {
                return <LayoutItem layout={layout} key={layout.id} />
            })}
        </div>
    </div>
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

class SaveButton extends React.Component {
    saveLayout(e) {
        if (e.key === 'Enter') {
            this.props.addLayout(this.refs.nameInput.value);
            this.refs.nameInput.value = '';
        }
    }

    render() {
        return <div className="item">
            <div className="ui icon input">
                <input type="text" placeholder="Save as..." ref="nameInput" onKeyPress={this.saveLayout.bind(this)}/>
                <i className="save icon"/>
            </div>
        </div>
    }
}

class LayoutItem extends React.Component {
    render() {
        return <div className="item" onClick={this.props.loadLayout.bind(this, this.props.layout)}>{this.props.layout.name}</div>
    }
}

LayoutItem.propTypes = {
    loadLayout: Prop.func
};

const LayoutItem = connect(
    (state) => {
        return {
            layouts: valuesOf(state.layouts),
            widgets: state.widgets
        }
    },
    (dispatch, props)=> {
        return {
            addLayout: (name) => dispatch(Layouts.addLayout(name, props.widgets))
        }
    }
)(LayoutItem)


const SaveLayout = connect((state) => {
        return {
            layouts: valuesOf(state.layouts),
            widgets: state.widgets
        }
    },
    (dispatch, props)=> {
        return {
            addLayout: (name) => dispatch(Layouts.addLayout(name, props.widgets))
        }
    })(SaveButton);


export {TopNavItemContainer as TopNavItem}


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