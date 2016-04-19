import React from 'react'
import ModalDialog from '../ui/modal.ui'
import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import {connect} from 'react-redux'
import {valuesOf, chunk} from '../util/collection'
import * as ui from '../ui/elements.ui'
import * as SettingsUi from '../ui/settings.ui'
import serializeForm from '../util/formSerializer'
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
        let props = this.props;

        const actions = [
            {
                className: "ui right black button",
                label: "Cancel",
                onClick: () => true
            },
            {
                className: "ui right labeled icon positive button",
                iconClass: "save icon",
                label: "Create",
                onClick: () => {
                    const options = {
                        hash: true,
                        disabled: true,
                        empty: true,
                        realBooleans: true
                    };

                    const formData = serializeForm(this.refs.form, options);
                    const {type, ...dsProps} = formData;
                    this.props.addDatasource(type, dsProps);
                    this.setState({selectedType: ""});
                    return true;
                }
            }
        ];


        const datasources = DatasourcePlugins.getPlugins();
        const selectedSource = DatasourcePlugins.getPlugin(this.state.selectedType) || {settings: {}};

        return <ModalDialog id="datasource-create"
                            title="Create Datasource"
                            actions={actions}
        >
            <div className="ui one column grid">
                <div className="column">
                    <form className="ui form" ref="form">
                        <div className="field">
                            <label>Type</label>
                            <select className="ui fluid dropdown" name="type" value={this.state.selectedType}
                                    onChange={(e) => {this.setState({selectedType: e.target.value});}}
                            >
                                <option key="none" value="">Select Type...</option>
                                {valuesOf(datasources).map(source => {
                                    return <option key={source.type} value={source.type}>{source.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="two fields">
                            <div className="field">
                                <label>Name</label>
                                <input name="name" placeholder="Name of the Datasource ..."/>
                            </div>

                            <div className="field">
                                <label>Update Intervall</label>
                                <input name="interval" placeholder="Update Interval in Seconds ..." defaultValue="5"/>
                            </div>
                        </div>
                        <ui.Divider/>
                        {
                            chunk(valuesOf(selectedSource.settings, 'id'), 2).map(chunk => {
                                return <div key={chunk[0].id} className="two fields">
                                    {selectedSource ?
                                        chunk.map(setting => {
                                            return <SettingsUi.Field key={setting.id} {...setting}/>;
                                        })
                                        :
                                        null
                                    }
                                </div>
                            })
                        }

                    </form>

                </div>
            </div>
        </ModalDialog>
    };
}

Modal.propTypes = {
    addDatasource: Prop.func.isRequired
};

const CreateDatasourceDialog = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            addDatasource: (type, dsProps) => {
                dispatch(Datasource.addDatasource(type, dsProps))
            }
        }
    }
)(Modal);

export {CreateDatasourceDialog as Modal}