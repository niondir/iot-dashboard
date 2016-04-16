import React from 'react';
import {connect} from 'react-redux'
import * as Import from './import'
import ModalDialog from '../ui/modal.ui'
const Prop = React.PropTypes;


const TopNavItem = (props) => {
    return <div className="ui simple dropdown item">
        Board
        <i className="dropdown icon"/>
        <div className="ui menu">
            <a className="item" onClick={() => ModalDialog.showModal("dashboard-import-export")}>
                <i className="folder open outline icon"/>
                Import / Export
            </a>

        </div>
    </div>
};

TopNavItem.propTypes = {};

const TopNavItemContainer = connect((state) => {
    return {
        state: state
    }
}, (dispatch) => {
    return {}
})(TopNavItem);

export {TopNavItemContainer as TopNavItem}

export class Modal extends React.Component {


    componentWillReceiveProps(nextProps) {
        this.refs.data.value = Import.serialize(nextProps.state);
    }

    render() {
        let props = this.props;
        console.log("state")
        console.log(props.state)
        const actions = [
            {
                className: "ui right black button",
                label: "Close",
                onClick: () => true
            },
            {
                className: "ui right labeled icon positive button",
                iconClass: "folder open icon",
                label: "Import",
                onClick: () => {
                    props.doImport(this.refs.data.value);
                    return true;
                }
            }
        ];

        return <ModalDialog id="dashboard-import-export"
                            title="Import / Export Dashboard"
                            actions={actions}
        >
            <div className="ui one column grid">
                <div className="column">
                    <form className="ui form">
                        <div className="field">
                            <label>Data</label>
                            <textarea ref="data" rows="10" defaultValue={Import.serialize(props.state)}></textarea>
                        </div>
                    </form>

                </div>
            </div>
        </ModalDialog>
    };
}

Modal.propTypes = {
    state: Prop.object,
    doImport: Prop.func.isRequired
};


const ModalContainer = connect((state) => {
    return {
        state: state
    }
}, (dispatch) => {
    return {
        doImport: (state) => dispatch(Import.doImport(state))
    }
})(Modal);

export {ModalContainer as Modal}