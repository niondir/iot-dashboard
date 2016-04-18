import React from 'react'
import ModalDialog from '../ui/modal.ui'
import * as Datasource from './datasource'
import DatasourcePlugins from './datasourcePlugins'
import {connect} from 'react-redux'
import {valuesOf} from '../util/collection'
import * as ui from '../ui/elements.ui'
import * as SettingsUi from '../ui/settings.ui'
const Prop = React.PropTypes;


const TopNavItem = (props) => {
    return <div className="ui simple dropdown item">
        Datasources
        <i className="dropdown icon"/>
        <div className="ui menu">
            <ui.LinkItem icon="plus" onClick={() => {props.createDatasource()}}>Add Datasource</ui.LinkItem>
            <ui.Divider/>
            <ui.LinkItem onClick={() => {}}>
                <ui.Icon type="delete" size="huge" align="right" onClick={() => alert()}/>
                Random Values
            </ui.LinkItem>
            <ui.LinkItem onClick={() => {}}>
                <ui.Icon type="delete" size="huge" align="right"/>
                Time
            </ui.LinkItem>
            <ui.LinkItem onClick={() => {}}>Test</ui.LinkItem>
        </div>
    </div>
};

TopNavItem.propTypes = {
    createDatasource: Prop.func,
    datasources: Prop.arrayOf(
        Prop.shape({
            name: Prop.string
        })
    )
};

const TopItemNavComponent = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            createDatasource: () => ModalDialog.showModal("datasource-create")
        }
    }
)(TopNavItem);

export {TopItemNavComponent as TopNavItem}

export class Modal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            selectedType: ''
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUpdate() {
        console.log("State: ", this.state)
    }

    componentDidMount() {
        this._initPopup();
    }

    componentDidUpdate() {
        this._initPopup();
        console.log("State: ", this.state)
    }

    _initPopup() {
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
                    props.createDatasource(this.refs.data.value);
                    return true;
                }
            }
        ];

        const datasources = DatasourcePlugins.getPlugins();
        const selectedSource = DatasourcePlugins.getPlugin(this.state.selectedType);

        return <ModalDialog id="datasource-create"
                            title="Create Datasource"
                            actions={actions}
        >
            <div className="ui one column grid">
                <div className="column">
                    <form className="ui form"
                          onSubmit={e => {console.log($(e.target).serialize()); e.preventDefault();}}
                          onInput={(e) => {
                          let value = e.target.value;

                          if (e.target.type === "checkbox") {
                            value = e.target.checked;
                          }
                           console.log("onInput", value);
                          //this.setState({[e.target.name]: value});
                          }}
                          onChange={(e) => {
                          let value = e.target.value;

                          if (e.target.type === "checkbox") {
                            value = e.target.checked;
                          }

                            console.log("onChange", value)
                          this.setState({[e.target.name]: value});
                          }}
                    >
                        <div className="field">
                            <label>Type</label>
                            <select className="ui fluid dropdown" value={this.state.selectedType} onChange={(e) => {
                            this.setState({selectedType: e.target.value});
                            }}>
                                <option key="none" value="">Select Type...</option>
                                {valuesOf(datasources).map(source => {
                                    return <option key={source.type} value={source.type}>{source.name}</option>
                                })}
                            </select>
                        </div>
                        <ui.Divider/>
                        {selectedSource ?
                            valuesOf(selectedSource.settings, 'id').map(setting => {
                                return <SettingsUi.Field key={setting.id} {...setting}/>;
                            })
                            :
                            null
                        }
                        <input type="submit" value="Submit"/>
                    </form>

                </div>
            </div>
        </ModalDialog>
    };
}

Modal.propTypes = {
    datasource: Prop.object,
    createDatasource: Prop.func
};