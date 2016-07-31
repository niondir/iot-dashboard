/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import ModalDialog from '../modal/modalDialog.ui.js'
import {connect} from 'react-redux'
import * as _ from 'lodash'
import {reset} from 'redux-form';
import * as ui from '../ui/elements.ui'
import * as ModalIds from '../modal/modalDialogIds'
import * as Modal from '../modal/modalDialog'
import * as Plugins from '../pluginApi/plugins'
import * as WidgetsPlugins from '../widgets/widgetPlugins'
import * as DatasourcePlugins from '../datasource/datasourcePlugins'
import {PropTypes as Prop}  from "react";

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

        const datasourcePluginStates = _.valuesIn(props.datasourcePlugins);
        const widgetPluginStates = _.valuesIn(props.widgetPlugins);

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
                                       defaultValue="plugins/TestWidgetPlugin.js"
                                />
                            </div>
                        </div>
                        <div className="ui button" onClick={() => props.loadPlugin(this.refs.pluginUrl.value)}
                             tabIndex="0">
                            Load Plugin
                        </div>
                    </form>
                    <h4 className="ui dividing header">Datasource Plugins</h4>
                    <DatasourcePluginList datasourceStates={datasourcePluginStates} {...props} />
                    <h4 className="ui dividing header">Widget Plugins</h4>
                    <WidgetPluginList widgetPluginStates={widgetPluginStates} {...props} />
                </div>
            </div>
        </ModalDialog>
    }
}

PluginsModal.propTypes = {
    datasourcePlugins: Prop.object.isRequired,
    widgetPlugins: Prop.object.isRequired,
    closeDialog: Prop.func.isRequired,
    loadPlugin: Prop.func.isRequired
};

export default connect(
    (state) => {
        return {
            widgetPlugins: state.widgetPlugins,
            datasourcePlugins: state.datasourcePlugins
        }
    },
    (dispatch) => {
        return {
            closeDialog: () => dispatch(Modal.closeModal()),
            // TODO: Render loading indicator while Plugin loads
            // maybe build some generic solution for Ajax calls where the state can hold all information to render loading indicators / retry buttons etc...
            loadPlugin: (url) => dispatch(Plugins.startLoadingPluginFromUrl(url))
        }
    }
)(PluginsModal);

const DatasourcePluginList = (props) => {
    return <div className="ui five cards">
        {
            props.datasourceStates.map(dsState => {
                return <DatasourcePluginCard key={dsState.id} pluginState={dsState} {...props}/>;
            })
        }
    </div>
};

DatasourcePluginList.propTypes = {
    datasourceStates: Prop.arrayOf(
        Prop.shape({
            id: Prop.string.isRequired
        })
    ).isRequired
};


const WidgetPluginList = (props) => {
    return <div className="ui five cards">
        {
            props.widgetPluginStates.map(dsState => {
                return <WidgetPluginCard key={dsState.id} pluginState={dsState} {...props}/>;
            })
        }
    </div>
};

WidgetPluginList.propTypes = {
    widgetPluginStates: Prop.arrayOf(WidgetsPlugins.widgetPluginType)
};


class PluginCard extends React.Component {

    _copyUrl() {
        this.refs.url.focus();
        this.refs.url.select();
        document.execCommand('copy');
    }

    render() {
        const props = this.props;
        const pluginState = props.pluginState;
        return <div className="card">
            <div className="content">
                <div className="header">{pluginState.typeInfo.name}</div>
                <div className="description">
                    <p>Type: {pluginState.typeInfo.type}</p>
                    <p>{pluginState.typeInfo.description ? pluginState.typeInfo.description : "No Description."}</p>
                </div>
            </div>
            <div className="extra content">
                <i className="copy outline icon" onClick={() => {this._copyUrl()}} style={{display:"inline"}}/>
                <div className="ui large transparent input">
                    <input type="text" ref="url"
                           readOnly
                           style={{width: "100%", paddingLeft: 0, paddingRight: 0}}
                           placeholder="Plugin Url ..."
                           defaultValue={pluginState.url ? pluginState.url : "Packaged"}/>
                </div>
            </div>
            <div className="ui bottom attached button" onClick={() => props.removePlugin(pluginState.id)}>
                <i className="trash icon"/>
                Remove
            </div>
        </div>
    }
}

PluginCard.propTypes = {
    pluginState: Prop.object.isRequired,
    removePlugin: Prop.func.isRequired
};

const WidgetPluginCard = connect(
    state => {
        return {}
    },
    dispatch => {
        return {
            removePlugin: (type) => dispatch(WidgetsPlugins.unloadPlugin(type))
        }
    }
)(PluginCard);

const DatasourcePluginCard = connect(
    state => {
        return {}
    },
    dispatch => {
        return {
            removePlugin: (type) => dispatch(DatasourcePlugins.unloadPlugin(type))
        }
    }
)(PluginCard);