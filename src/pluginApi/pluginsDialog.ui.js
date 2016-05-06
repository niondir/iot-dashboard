import React from 'react'
import ModalDialog from '../modal/modalDialog.ui.js'
import {connect} from 'react-redux'
import _ from 'lodash'
import {reset} from 'redux-form';
import * as ui from '../ui/elements.ui'
import * as ModalIds from '../modal/modalDialogIds'
import * as Modal from '../modal/modalDialog'
import * as Plugins from '../pluginApi/plugins'
const Prop = React.PropTypes;

class PluginsModal extends React.Component {

    render() {
        const props = this.props;

        const actions = [
            {
                className: "ui right labeled icon positive button",
                iconClass: "save icon",
                label: "Close",
                onClick: () => {
                    props.closeDialog()
                }
            }
        ];

        const datasourceStates = _.valuesIn(props.plugins).filter(ds => ds.isDatasource);

        return <ModalDialog id={ModalIds.PLUGINS}
                            title="Plugins"
                            actions={actions}
        >
            <div className="ui one column grid">
                <div className="column">
                    <form className="ui form">
                        <h4 className="ui dividing header">Load Plugin</h4>
                        <div className="field">
                            <label>From URL</label>
                            <div className="field">
                                <input ref="pluginUrl" type="text" name="plugin-url"
                                       placeholder="http://my-page.com/myPlugin.js"
                                       defaultValue="http://localhost:8080/plugins/TestDatasourcePlugin.js"
                                />
                            </div>
                        </div>
                        <div className="ui button" onClick={() => props.loadPlugin(this.refs.pluginUrl.value)}
                             tabIndex="0">
                            Load Plugin
                        </div>
                    </form>
                    <h4 className="ui dividing header">Datasource Plugins</h4>
                    <DatasourcePluginList datasourceStates={datasourceStates} {...props} />
                    <h4 className="ui dividing header">Widget Plugins</h4>
                    <p>Comming soon ...</p>
                </div>
            </div>
        </ModalDialog>
    };
}

PluginsModal.propTypes = {
    plugins: Prop.object.isRequired,
    closeDialog: Prop.func.isRequired,
    loadPlugin: Prop.func.isRequired,
    removePlugin: Prop.func.isRequired
};

export default connect(
    (state) => {
        return {
            plugins: state.plugins
        }
    },
    (dispatch) => {
        return {
            closeDialog: () => dispatch(Modal.closeModal()),
            loadPlugin: (url) => dispatch(Plugins.loadPluginFromUrl(url)),
            removePlugin: (type) => alert("Sorry not yet ...")

        }
    }
)(PluginsModal);

const DatasourcePluginList = (props) => {
    return <div className="ui five cards">
        {
            props.datasourceStates.map(dsState => {
                return <DatasourcePluginCard key={dsState.id} datasourceState={dsState} {...props}/>;
            })
        }
    </div>
};

DatasourcePluginList.propTypes = {
    datasourceStates: Prop.array.isRequired
};

class DatasourcePluginCard extends React.Component {

    _copyUrl() {
        this.refs.url.focus();
        this.refs.url.select();
        document.execCommand('copy');
    }

    render() {
        const props = this.props;
        const dsState = props.datasourceState;
        return <div className="card">
            <div className="content">
                <div className="header">{dsState.typeInfo.name}</div>
                <div className="description">
                    <p>Type: {dsState.typeInfo.type}</p>
                    <p>{dsState.typeInfo.description ? dsState.typeInfo.description : "No Description."}</p>
                </div>
            </div>
            <div className="extra content">
                <i className="copy outline icon" onClick={() => {this._copyUrl()}} style={{display:"inline"}}/>
                <div className="ui large transparent input">
                    <input type="text" ref="url"
                           readonly
                           style={{width: "100%", paddingLeft: 0, paddingRight: 0}}
                           placeholder="Plugin Url ..."
                           defaultValue={dsState.url ? dsState.url : "Packaged"}/>
                </div>
            </div>
            <div className="ui bottom attached button" onClick={() => props.removePlugin(dsState.id)}>
                <i className="trash icon"/>
                Remove
            </div>
        </div>
    }
};

DatasourcePluginCard.propTypes = {
    datasourceState: Prop.object.isRequired,
    removePlugin: Prop.func.isRequired
};