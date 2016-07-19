/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as DsPlugin from './datasourcePlugin'
import PluginRegistry from '../pluginApi/pluginRegistry'
import * as Action from "../actionNames";
import {genCrudReducer} from "../util/reducer";

// TODO: Later load all plugins from external URL's ?
const initialState = {};

export class DatasourcePluginRegistry extends PluginRegistry {

    createPluginFromModule(module) {
        return  new DsPlugin.DataSourcePlugin(module, this.store);
    }
}


export const pluginRegistry = new DatasourcePluginRegistry();

export function unloadPlugin(type) {
    return function(dispatch) {
        const dsFactory = pluginRegistry.getPlugin(type);
        dsFactory.dispose();
        dispatch(deletePlugin(type));
    }
}

function deletePlugin(type) {
    return {
        type: Action.DELETE_DATASOURCE_PLUGIN,
        id: type
    }
}

const pluginsCrudReducer = genCrudReducer([Action.ADD_DATASOURCE_PLUGIN, Action.DELETE_DATASOURCE_PLUGIN], datasourcePlugin);
export function datasourcePlugins(state = initialState, action) {

    state = pluginsCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }

}

function datasourcePlugin(state, action) {
    switch (action.type) {
        case Action.ADD_DATASOURCE_PLUGIN:
            if (!action.typeInfo.type) {
                // TODO: Catch this earlier
                throw new Error("A Plugin needs a type name.");
            }

            return {
                id: action.typeInfo.type,
                url: action.url,
                typeInfo: action.typeInfo,
                isDatasource: action.pluginType === "datasource",
                isWidget: action.pluginType === "widget"
            };
        default:
            return state;
    }
}
