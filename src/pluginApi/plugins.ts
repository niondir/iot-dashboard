/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Action from "../actionNames";
import * as AppState from "../appState";
import {IPluginModule} from "./pluginRegistry";
import {IDatasourcePluginModule} from "../datasource/datasourcePluginRegistry";

const initialState: IPluginLoaderState = {
    loadingUrls: []
};

export interface IPluginLoaderState {
    loadingUrls: string[]
}
export interface IPluginLoaderAction extends AppState.Action {
    url?: string
}


export function startLoadingPluginFromUrl(url: string): IPluginLoaderAction {
    return {
        type: Action.STARTED_LOADING_PLUGIN_FROM_URL,
        url
    }
}

/**
 * Set the status of a plugin that might be already in the state to be loading
 */
export function pluginIsLoading(id: string, isLoading: boolean) {
    return {
        type: Action.PLUGIN_IS_LOADING,
        id,
        isLoading
    }
}

export function widgetPluginFinishedLoading(plugin: IPluginModule, url: string = null) {
    return {
        type: Action.WIDGET_PLUGIN_FINISHED_LOADING,
        id: plugin.TYPE_INFO.type, // needed for crud reducer
        typeInfo: plugin.TYPE_INFO,
        isLoading: false,
        url
    };

}

export function datasourcePluginFinishedLoading(plugin: IDatasourcePluginModule, url: string = null) {
    return {
        type: Action.DATASOURCE_PLUGIN_FINISHED_LOADING,
        id: plugin.TYPE_INFO.type, // needed for crud reducer
        typeInfo: plugin.TYPE_INFO,
        isLoading: false,
        url
    };

}

export function pluginLoaderReducer(state: IPluginLoaderState = initialState, action: IPluginLoaderAction) {
    switch (action.type) {
        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
        {
            const newState = _.assign<any, IPluginLoaderState>({}, state);
            newState.loadingUrls = urlsReducer(state.loadingUrls, action);
            return newState;
        }
        case Action.WIDGET_PLUGIN_FINISHED_LOADING:
        case Action.DATASOURCE_PLUGIN_FINISHED_LOADING:
        {
            const newState = _.assign<any, IPluginLoaderState>({}, state);
            newState.loadingUrls = urlsReducer(state.loadingUrls, action);
            return newState;
        }
        default:
            return state;
    }
}

function urlsReducer(state: string[], action: IPluginLoaderAction): string[] {
    switch (action.type) {
        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
            return [...state].concat([action.url]);
        case Action.WIDGET_PLUGIN_FINISHED_LOADING:
        case Action.DATASOURCE_PLUGIN_FINISHED_LOADING:
            return [...state].filter((url) => url !== action.url);
        default:
            return state;
    }
}