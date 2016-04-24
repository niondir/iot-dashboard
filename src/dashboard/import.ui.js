import React from 'react';
import {connect} from 'react-redux'
import * as Import from './import'
import ModalDialog from '../modal/modalDialog.ui.js'
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


    constructor(props) {
        super(props);

        this.state = {state: null}
    }

    componentWillReceiveProps(nextProps) {
        //this.refs.data.value = Import.serialize(nextProps.state);
    }

    componentDidMount() {
    }

    _loadData() {
        this.refs.data.value = Import.serialize(this.props.state);
        this.refs.data.focus();
        this.refs.data.select();
    }

    _clearData() {
        this.refs.data.value = "";
        this.refs.data.focus();
        this.refs.data.select();
    }

    _exportToClipboard() {
        this.refs.data.focus();
        this.refs.data.select();
        document.execCommand('copy')

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    }

    render() {
        let props = this.props;
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
                    <button className="ui compact labeled icon button" onClick={this._loadData.bind(this)}>
                        <i className="refresh icon"></i>
                        Refresh Data
                    </button>
                    <button className="ui compact labeled icon button" onClick={this._exportToClipboard.bind(this)}>
                        <i className="upload icon"></i>
                        Copy to Clipboard
                    </button>
                    <button className="ui compact labeled icon button" onClick={this._clearData.bind(this)}>
                        <i className="erase icon"></i>
                        Clear Data
                    </button>
                </div>
                <div className="column">
                    <form className="ui form">
                        <div className="field">
                            <label>Data</label>
                            <textarea ref="data" rows="10" onFocus={(e) => e.target.select()}
                                      placeholder='Click "Refresh Data" to get data for export or paste your data here ...'/>
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