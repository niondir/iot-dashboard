import * as Action from "../actionNames";
import {genCrudReducer} from "../util/reducer";
import * as DatasourcePlugins from "../datasource/datasourcePlugins";
import * as WidgetPlugins from "../widgets/widgetPlugins";
import loadjs from "loadjs";
import * as PluginApi from "./pluginApi";
import _ from "lodash";
import URI from "urijs";



export function loadPlugin(plugin) {
    return addPlugin(plugin);
}


export function loadPluginFromUrl(url) {
    return function (dispatch) {
        loadjs([url], () => {
            if (PluginApi.hasPlugin()) {
                const plugin = PluginApi.popLoadedPlugin();

                const dependencies = plugin.TYPE_INFO.dependencies;
                if (_.isArray(dependencies)) {

                    var paths = dependencies.map(dependency => {
                        return URI(dependency).absoluteTo(url).toString();
                    });

                    console.log("Loading Dependencies for Plugin", paths);

                    // TODO: Load Plugins into a sandbox / iframe, and pass as "deps" object
                    // Let's wait for the dependency hell before introducing this.
                    // Until then we can try to just provide shared libs by the Dashboard, e.g. jQuery, d3, etc.
                    // That should avoid that people add too many custom libs.
                    /*sandie([dependencies],
                     function (deps) {
                     plugin.deps = deps;
                     console.log("deps loaded", deps);
                     dispatch(addPlugin(plugin, url));
                     }
                     );  */


                    loadjs(paths, () => {
                        dispatch(addPlugin(plugin, url));
                    });
                }
                else {
                    dispatch(addPlugin(plugin, url));
                }
            }
            else {
                console.error("Failed to load Plugin. Make sure it called window.iotDashboardApi.register***Plugin from url " + url);
            }
        });
    };
}

export function unloadPlugin() {
    return function(dispatch) {
        DatasourcePlugins
        dispatch(deletePlugin(type)); 
    }
}

function deletePlugin(type) {
    return {
        type: Action.DELETE_PLUGIN,
        pluginType: type
    }
}

export function initializeExternalPlugins() {
    return (dispatch, getState) => {
        const state = getState();
        const plugins = _.valuesIn(state.plugins);

        plugins.filter(pluginState => !_.isEmpty(pluginState.url)).forEach(plugin => {
            dispatch(loadPluginFromUrl(plugin.url));
        })
    }
}

function registerPlugin(plugin) {
    const type = plugin.TYPE_INFO.type;
    if (plugin.Datasource) {
        const dsPlugin = DatasourcePlugins.pluginRegistry.getPlugin(type);
        if (!dsPlugin) {
            DatasourcePlugins.pluginRegistry.register(plugin);
        }
        else {
            console.warn("Plugin of type " + type + " already loaded:", dsPlugin, ". Tried to load: ", plugin);
        }
    }
    else if (plugin.Widget) {
        const widgetPlugin = WidgetPlugins.pluginRegistry.getPlugin(type);
        if (!widgetPlugin) {
            WidgetPlugins.pluginRegistry.register(plugin);
        }
        else {
            console.warn("Plugin of type " + type + " already loaded:", widgetPlugin, ". Tried to load: ", plugin);
        }
    }
    else {
        throw new Error("Plugin neither defines a Datasource nor a Widget.", plugin);
    }
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
            registerPlugin(plugin);
            return;
        }

        let pluginType = "unknown";
        if (plugin.Datasource !== undefined) {
            pluginType = "datasource";
        }
        if (plugin.Widget !== undefined) {
            pluginType = "widget";
        }

        // TODO: Just put the raw plugin + url here and let the reducer do the logic
        dispatch({
            type: Action.ADD_PLUGIN,
            id: plugin.TYPE_INFO.type, // needed for crud reducer
            typeInfo: plugin.TYPE_INFO,
            url,
            pluginType: pluginType
        });
        // TODO: Maybe use redux sideeffect and move this call to the reducer
        registerPlugin(plugin);
    }
}
