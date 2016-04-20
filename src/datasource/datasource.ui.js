import React from 'react'
import ModalDialog from '../ui/modal.ui'
import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import {connect} from 'react-redux'
import {valuesOf, chunk} from '../util/collection'
import * as ui from '../ui/elements.ui'
import * as SettingsUi from '../ui/settings.ui'
import serializeForm from '../util/formSerializer'
import {reduxForm, reset} from 'redux-form';
const Prop = React.PropTypes;


const TopNavItem = (props) => {
    return <div className="ui simple dropdown item">
        Datasources
        <i className="dropdown icon"/>
        <div className="ui menu">
            <ui.LinkItem icon="plus" onClick={() => {props.createDatasource()}}>Add Datasource</ui.LinkItem>
            <ui.Divider/>
            {
                valuesOf(props.datasources).map(ds => {
                    return <ui.LinkItem key={ds.id} onClick={() => {/*Edit*/}}>
                        <ui.Icon type="delete" size="huge" align="right" onClick={() => props.deleteDatasource(ds.id)}/>
                        {ds.props.name}
                    </ui.LinkItem>
                })
            }
        </div>
    </div>
};

TopNavItem.propTypes = {
    createDatasource: Prop.func.isRequired,
    deleteDatasource: Prop.func.isRequired,
    datasources: Prop.objectOf(
        Prop.shape({
            type: Prop.string.isRequired,
            id: Prop.string.isRequired,
            props: Prop.object.isRequired
        })
    ).isRequired
};

const TopItemNavComponent = connect(
    (state) => {
        return {
            datasources: state.datasources
        }
    },
    (dispatch) => {
        return {
            createDatasource: () => ModalDialog.showModal("datasource-create"),
            deleteDatasource: (id) => dispatch(Datasource.deleteDatasource(id))
        }
    }
)(TopNavItem);

export {TopItemNavComponent as TopNavItem}

export class Modal extends React.Component {

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
        this.props.restForm('datasource-settings');
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
        const selectedSource = DatasourcePlugins.getPlugin(this.state.selectedType) || {settings: {}};
        const fields = valuesOf(selectedSource.settings, "id").map(setting => setting.id);
        const initialValues = valuesOf(selectedSource.settings, "id").reduce((initialValues, setting) => {
            initialValues[setting.id] = setting.defaultValue;
            return initialValues;
        }, {interval: 5});

        return <ModalDialog id="datasource-create"
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
                    <SettingsReduxForm ref="form"
                                       form='datasource-settings'
                                       selectedType={this.state.selectedType}
                                       onSubmit={this.onSubmit.bind(this)}
                                       fields={["type", "name", "interval", ...fields]}
                                       initialValues={initialValues}
                    />

                </div>
            </div>
        </ModalDialog>
    };
}

Modal.propTypes = {
    addDatasource: Prop.func.isRequired,
    restForm: Prop.func.isRequired
};

const CreateDatasourceDialog = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            restForm: (id) => dispatch(reset(id)),
            addDatasource: (type, dsProps) => {
                dispatch(Datasource.addDatasource(type, dsProps))
            }
        }
    }
)(Modal);

class SettingsForm extends React.Component {


    componentDidMount() {
        this._initSemanticUi();
    }

    componentDidUpdate() {
        this._initSemanticUi();
    }

    _initSemanticUi() {
        $('.icon.help.circle')
            .popup({
                position: "top left",
                offset: -10
            });
        $('.ui.checkbox')
            .checkbox();
    }

    render() {
        const props = this.props;
        const fields = props.fields;
        const selectedSource = DatasourcePlugins.getPlugin(props.selectedType) || {settings: {}};

        return <form className="ui form">
            <div className="two fields">
                <div className="field">
                    <label>Name</label>
                    <input name="name" placeholder="Name of the Datasource ..." {...fields.name}/>
                </div>

                <div className="field">
                    <label>Update Intervall</label>
                    <input name="interval" placeholder="Update Interval in Seconds ..." {...fields.interval}/>
                </div>
            </div>
            <ui.Divider/>
            {
                chunk(valuesOf(selectedSource.settings, 'id'), 2).map(chunk => {
                    return <div key={chunk[0].id} className="two fields">
                        {selectedSource ?
                            chunk.map(setting => {
                                return <SettingsUi.Field key={setting.id} {...setting} field={fields[setting.id]}/>;
                            })
                            :
                            null
                        }
                    </div>
                })
            }

        </form>
    }
}

SettingsForm.propTypes = {
    selectedType: Prop.string.isRequired
};

const SettingsReduxForm = reduxForm({})(SettingsForm);

export {CreateDatasourceDialog as Modal}