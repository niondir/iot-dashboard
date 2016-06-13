import React from 'react'
import ModalDialog from '../modal/modalDialog.ui.js'
import * as Datasource from './datasource'
import {connect} from 'react-redux'
import _ from 'lodash'
import * as ui from '../ui/elements.ui'
import SettingsForm from '../ui/settingsForm.ui'
import {reset} from 'redux-form';
import * as ModalIds from '../modal/modalDialogIds'
import {PropTypes as Prop}  from "react";

const DIALOG_ID = ModalIds.DATASOURCE_CONFIG;
const FORM_ID = "datasource-settings-form";

export function unshiftIfNotExists(array:Array, element, isEqual = (a, b) => a.id == b.id) {
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
            let selectedType = nextProps.dialogData.datasource.type;
            this.state = {
                selectedType: selectedType
            };
        }
    }

    onSubmit(formData, dispatch) {
        let id = undefined;
        if (this._isEditing()) {
            id = this._getEditingDatasource().id;
        }
        this.props.createOrUpdateDatasource(id, this.state.selectedType, formData);
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
        
        let selectedSource;
        if (this.state.selectedType) {
            selectedSource = props.datasourcePlugins[this.state.selectedType];
        }

        let settings = [];
        if (selectedSource && selectedSource.typeInfo.settings) {
            settings = [...selectedSource.typeInfo.settings];
        }
        else {
            settings = [];
        }
        
        unshiftIfNotExists(settings, {
            id: 'name',
            name: 'Name',
            type: 'string',
            defaultValue: ""
        });


        const fields = settings.map(setting => setting.id);
        let initialValues = {};
        if (this._isEditing()) {
            initialValues = {...this._getEditingDatasource().props}
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
    createOrUpdateDatasource: Prop.func.isRequired,
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
            createOrUpdateDatasource: (id, type, dsProps) => {
                dispatch(Datasource.createOrUpdateDatasource(id, type, dsProps))
            }
        }
    }
)(DatasourceConfigModal);