/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Action from "../actionNames";
import {genCrudReducer} from "../util/reducer.js";
import * as AppState from "../appState";
import Dashboard from "../dashboard";


// TODO: does it work to have the URL as ID?
const initialState: IDatasourcePluginsState = {
    "random": { // TODO: can we have another id (id != plugin type) without breaking stuff?
        id: "random",
        url: "./plugins/datasources/randomDatasource.js",
        typeInfo: {
            type: "will-be-loaded"
        }
    },
    "time": {
        id: "time",
        url: "./plugins/datasources/timeDatasource.js",
        typeInfo: {
            type: "will-be-loaded"
        }
    },
    "digimondo-gps-datasource": {
        id: "digimondo-gps-datasource",
        url: "./plugins/datasources/DigimondoGpsDatasource.js",
        typeInfo: {
            type: "will-be-loaded"
        }
    }
};


export interface IDatasourcePluginsState {
    [key: string]: IDatasourcePluginState
}


export interface IDatasourcePluginState {
    id: string
    typeInfo: AppState.ITypeInfo
    url: string
}


export interface IDatasourcePluginAction extends AppState.Action {
    typeInfo: AppState.ITypeInfo
    url: string
    pluginType: string
    isLoading: boolean
}


export function unloadPlugin(type: string) {
    return function (dispatch: AppState.Dispatch) {
        const dsFactory = Dashboard.getInstance().datasourcePluginRegistry.getPlugin(type);
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
                throw new Error("A Plugin needs a type name. Please define TYPE_INFO.type");
            }

            return <IDatasourcePluginState>{
                id: action.typeInfo.type,
                url: action.url,
                typeInfo: action.typeInfo
            };
        case Action.PLUGIN_IS_LOADING:
            return _.assign<any, IDatasourcePluginState>({}, state, {isLoading: action.isLoading});
        default:
            return state;
    }
}
