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
                        <div className="ui button" onClick={() => props.loadPlugin(this.refs.pluginUrl.value)} tabIndex="0">
                            Load Plugin
                        </div>
                    </form>
                    <ui.Divider/>

                </div>
            </div>
        </ModalDialog>
    };
}

export default connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            closeDialog: () => {
                dispatch(Modal.closeModal())
            },
            loadPlugin: (url) => {dispatch(Plugins.loadPluginFromUrl(url))}
        }
    }
)(PluginsModal);