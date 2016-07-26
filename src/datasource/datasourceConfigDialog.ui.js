/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import ModalDialog from '../modal/modalDialog.ui.js'
import * as Datasource from './datasource'
import {connect} from 'react-redux'
import * as _ from 'lodash'
import * as ui from '../ui/elements.ui'
import SettingsForm from '../ui/settingsForm.ui'
import {reset} from 'redux-form';
import * as ModalIds from '../modal/modalDialogIds'
import {PropTypes as Prop}  from "react";

const DIALOG_ID = ModalIds.DATASOURCE_CONFIG;
const FORM_ID = "datasource-settings-form";

export function unshiftIfNotExists(array, element, isEqual = (a, b) => a.id == b.id) {
    if (array.find((e) => isEqual(e, element)) == undefined) {
        array.unshift(element);
    }
}

class DatasourceConfigModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedType: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dialogData.datasource) {
            const selectedType = nextProps.dialogData.datasource.type;
            this.state = {
                selectedType: selectedType
            };
        }
    }

    onSubmit(formData, dispatch) {
        if (this._isEditing()) {
            const id = this._getEditingDatasource().id;
            this.props.updateDatasource(id, this.state.selectedType, formData);
        }
        else {
            this.props.createDatasource(this.state.selectedType, formData);
        }
        return true;
    }

    resetForm() {
        this.props.resetForm(FORM_ID);
    }

    _isEditing() {
        return !!this.props.dialogData.datasource;
    }

    _getEditingDatasource() {
        return this.props.dialogData.datasource;
    }


    render() {
        const props = this.props;
        const actions = [
            {
                className: "ui right button",
                label: "Reset",
                onClick: () => {
                    this.resetForm();
                    return false;
                }
            },
            {
                className: "ui right red button",
                label: "Cancel",
                onClick: () => {
                    this.resetForm();
                    return true;
                }
            },
            {
                className: "ui right labeled icon positive button",
                iconClass: "save icon",
                label: this._isEditing() ? "Save" : "Create",
                onClick: () => {
                    const success = this.refs.form.submit();
                    if (success) this.resetForm();
                    return success;
                }
            }
        ];

        let selectedDsPluginState;
        if (this.state.selectedType) {
            selectedDsPluginState = props.datasourcePlugins[this.state.selectedType];
        }

        let settings = [];
        if (selectedDsPluginState && selectedDsPluginState.typeInfo.settings) {
            settings = [...selectedDsPluginState.typeInfo.settings];
        }
        else {
            settings = [];
        }

        unshiftIfNotExists(settings, {
            id: 'name',
            name: 'Name',
            type: 'string',
            defaultValue: selectedDsPluginState ? selectedDsPluginState.typeInfo.name : ""
        });


        const fields = settings.map(setting => setting.id);
        let initialValues = {};
        if (this._isEditing()) {
            initialValues = Object.assign({}, this._getEditingDatasource().settings)
        }
        else {
            initialValues = settings.reduce((initialValues, setting) => {
                if (setting.defaultValue !== undefined) {
                    initialValues[setting.id] = setting.defaultValue;
                }
                return initialValues;
            }, {});
        }

        let title = "Create Datasource";
        if (this._isEditing()) {
            title = "Edit Datasource";
        }

        return <ModalDialog id={DIALOG_ID}
                            title={title}
                            actions={actions}
        >
            <div className="ui one column grid">
                <div className="column">
                    {selectedDsPluginState && selectedDsPluginState.typeInfo.description ?

                        <div className="ui icon message">
                            <i className="idea icon"/>
                            <div className="content">
                                {selectedDsPluginState.typeInfo.description}
                            </div>

                        </div>
                        : null
                    }
                    <div className="field">
                        <label>Type</label>
                        <select className="ui fluid dropdown" name="type" value={this.state.selectedType}
                                onChange={(e) => {this.setState({selectedType: e.target.value});}}
                            {...fields.type}
                        >
                            <option key="none" value="">Select Type...</option>
                            {_.valuesIn(props.datasourcePlugins).map(dsPlugin => {
                                return <option key={dsPlugin.id} value={dsPlugin.id}>{dsPlugin.typeInfo.name}</option>
                            })}
                        </select>
                    </div>
                    <ui.Divider/>
                    <SettingsForm ref="form"
                                  form={FORM_ID}
                                  onSubmit={this.onSubmit.bind(this)}
                                  fields={["type", "name", "interval", ...fields]}
                                  settings={settings}
                                  initialValues={initialValues}
                    />

                </div>
            </div>
        </ModalDialog>
    }
}

DatasourceConfigModal.propTypes = {
    createDatasource: Prop.func.isRequired,
    updateDatasource: Prop.func.isRequired,
    resetForm: Prop.func.isRequired,
    dialogData: Prop.object.isRequired,
    datasourcePlugins: Prop.object.isRequired
};


export default connect(
    (state) => {
        return {
            dialogData: state.modalDialog.data || {},
            datasourcePlugins: state.datasourcePlugins
        }
    },
    (dispatch) => {
        return {
            resetForm: (id) => dispatch(reset(id)),
            createDatasource: (type, dsSettings) => {
                dispatch(Datasource.createDatasource(type, dsSettings))
            },
            updateDatasource: (id, type, dsSettings) => {
                dispatch(Datasource.updateDatasource(id, type, dsSettings))
            }
        }
    }
)(DatasourceConfigModal);