import React from 'react'
import ModalDialog from '../ui/modal.ui'
import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import {connect} from 'react-redux'
import {valuesOf} from '../util/collection'
import * as ui from '../ui/elements.ui'
import SettingsForm from '../ui/settingsForm.ui'
import {reset} from 'redux-form';
const Prop = React.PropTypes;

const DIALOG_ID = "datasource-settings-dialog";
const FORM_ID = "datasource-settings-form";

export function showDialog() {
    ModalDialog.showModal(DIALOG_ID);
}

class DatasourceConfigModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedType: ''
        };
    }

    onSubmit(formData, dispatch) {
        this.props.addDatasource(this.state.selectedType, formData);
        return true;
    }

    resetForm() {
        this.props.resetForm('datasource-settings');
    }

    render() {
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
                label: "Create",
                onClick: () => {
                    const success = this.refs.form.submit();
                    if (success) this.resetForm();
                    return success;
                }
            }
        ];

        const datasources = DatasourcePlugins.getPlugins();
        const selectedSource = DatasourcePlugins.getPlugin(this.state.selectedType) || {settings: []};

        const settings = [...selectedSource.settings || []];
        settings.unshift({
                id: 'name',
                name: 'Name',
                type: 'string',
                defaultValue: ""
            },
            {
                id: 'interval',
                name: 'Interval',
                type: 'string',
                defaultValue: "5"
            });

        const fields = settings.map(setting => setting.id);
        const initialValues = settings.reduce((initialValues, setting) => {
            initialValues[setting.id] = setting.defaultValue;
            return initialValues;
        }, {interval: 5});

        // TODO: Add the additional fields (type, name interval) dynamically to the settings array

        return <ModalDialog id={DIALOG_ID}
                            title="Create Datasource"
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
                            {valuesOf(datasources).map(source => {
                                return <option key={source.type} value={source.type}>{source.name}</option>
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
    };
}

DatasourceConfigModal.propTypes = {
    addDatasource: Prop.func.isRequired,
    resetForm: Prop.func.isRequired
};

export default connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            resetForm: (id) => dispatch(reset(id)),
            addDatasource: (type, dsProps) => {
                dispatch(Datasource.addDatasource(type, dsProps))
            }
        }
    }
)(DatasourceConfigModal);