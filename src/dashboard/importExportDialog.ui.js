/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import {connect} from 'react-redux'
import * as Import from './import'
import ModalDialog from '../modal/modalDialog.ui.js'
import * as ModalIds from '../modal/modalDialogIds'
import {PropTypes as Prop}  from "react";

class ImportExportDialog extends React.Component {


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

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            alert('Oops, unable to copy');
        }
    }

    render() {
        const props = this.props;
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

        return <ModalDialog id={ModalIds.DASHBOARD_IMPORT_EXPORT}
                            title="Import / Export Dashboard"
                            actions={actions}
        >
            <div className="ui one column grid">
                <div className="column">
                    <button className="ui compact labeled icon button" onClick={this._loadData.bind(this)}>
                        <i className="refresh icon"></i>
                        Load Data
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
                            <textarea className="monospace" ref="data" rows="10" onFocus={(e) => e.target.select()}
                                      placeholder='Click "Load Data" to get data for export or paste your data here ...'/>
                        </div>
                    </form>

                </div>
            </div>
        </ModalDialog>
    }
}

ImportExportDialog.propTypes = {
    state: Prop.object,
    doImport: Prop.func.isRequired
};


export default connect((state) => {
    return {
        state: state
    }
}, (dispatch) => {
    return {
        doImport: (state) => dispatch(Import.doImport(state))
    }
})(ImportExportDialog);