/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as DsPlugin from './datasourcePlugin.js'
import PluginRegistry from '../pluginApi/pluginRegistry.js'
import * as Action from '../actionNames.js';
import {genCrudReducer} from '../util/reducer.js';
import * as AppState from '../appState'

const initialState: IDatasourcePluginsState = {};

interface IPluginModule {

}

export interface IDatasourcePluginsState {
    [key: string]: IDatasourcePluginState
}


export interface IDatasourcePluginState extends AppState.Action {
    id: string
    typeInfo: AppState.ITypeInfo
    url: string
    isDatasource: boolean
    isWidget: boolean
}


export interface IDatasourcePluginAction extends AppState.Action {
    typeInfo: AppState.ITypeInfo
    url: string
    pluginType: string
}


export class DatasourcePluginRegistry extends PluginRegistry {

    createPluginFromModule(module: IPluginModule) {
        return new DsPlugin.DataSourcePlugin(module, this.store);
    }
}


export const pluginRegistry = new DatasourcePluginRegistry();

export function unloadPlugin(type: string) {
    return function (dispatch: AppState.Dispatch) {
        const dsFactory = pluginRegistry.getPlugin(type);
        dsFactory.dispose();
        dispatch(deletePlugin(type));
    }
}

function deletePlugin(type: string) {
    return {
        type: Action.DELETE_DATASOURCE_PLUGIN,
        id: type
    }
}

const pluginsCrudReducer: Function = genCrudReducer([Action.ADD_DATASOURCE_PLUGIN, Action.DELETE_DATASOURCE_PLUGIN], datasourcePlugin);
export function datasourcePlugins(state: IDatasourcePluginsState = initialState, action: AppState.Action) {

    state = pluginsCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }

}

function datasourcePlugin(state: IDatasourcePluginState, action: IDatasourcePluginAction): IDatasourcePluginState {
    switch (action.type) {
        case Action.ADD_DATASOURCE_PLUGIN:
            if (!action.typeInfo.type) {
                // TODO: Catch this earlier
                throw new Error("A Plugin needs a type name.");
            }

            return <IDatasourcePluginState>{
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
