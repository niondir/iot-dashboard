import * as Action from '../actionNames'
import {genCrudReducer} from '../util/reducer'
import * as Uuid from '../util/uuid'
import DatasourcePlugins from '../datasource/datasourcePlugins'
import $script from 'scriptjs';
import * as PluginApi from './pluginApi'
import _  from 'lodash'

// TODO: Later load all plugins from external URL's ?
const initialState = {};

export function loadPlugin(plugin) {
    return addPlugin(plugin);
}

export function loadPluginFromUrl(url) {
    return function (dispatch) {
        $script([url], () => {
            if (PluginApi.hasPlugin()) {
                const plugin = PluginApi.popLoadedPlugin();
                dispatch(addPlugin(plugin, url));
            }
            else {
                console.error("Failed to load Plugin. Make sure it called window.iotDashboardApi.register***Plugin from url " + url);
            }
        });
    };
}

export function initializeExternalPlugins(plugins = []) {
    plugins.filter(pluginState => !_.isEmpty(pluginState.url)).forEach(plugin => {
        $script([plugin.url], () => {
            if (PluginApi.hasPlugin()) {
                const plugin = PluginApi.popLoadedPlugin();
                DatasourcePlugins.register(plugin); // It's already in the store
            }
            else {
                console.error("Failed to load Plugin. Already loaded?" +
                    "Make sure it called window.iotDashboardApi.register***Plugin from url " + url);
            }
        });

    })
}

// Add plugin to store and register it in the PluginRegistry
export function addPlugin(plugin, url = null) {
    console.log("Adding plugin from " + url, plugin);

    return function (dispatch, getState) {
        const state = getState();
        const plugins = state.plugins;

        const existentPluginState = _.valuesIn(plugins).find(pluginState => {
            return plugin.TYPE_INFO.type === pluginState.pluginType;
        });

        if (existentPluginState) {
            const type = existentPluginState.pluginType;

            // If this plugin is already in the state, but not registerd, we have to do so here...
            if (!DatasourcePlugins.getPlugin(type)) {
                DatasourcePlugins.register(plugin);
            }
            else {
                console.warn("Plugin of type " + type + " already loaded.", existentPluginState, plugin);
            }
            return;
        }

        dispatch({
            type: Action.ADD_PLUGIN,
            id: Uuid.generate(),
            pluginType: plugin.TYPE_INFO.type,
            url
        });
        DatasourcePlugins.register(plugin);
    }
}


const pluginsCrudReducer = genCrudReducer([Action.ADD_PLUGIN, Action.DELETE_PLUGIN], plugin);
export function plugins(state = initialState, action) {
    state = pluginsCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }

}

function plugin(state, action) {
    switch (action.type) {
        case Action.ADD_PLUGIN:
            return {
                id: action.id, // Type as id?
                url: action.url,
                pluginType: action.pluginType,
                isDatasource: true
            };
        default:
            return state;
    }

}