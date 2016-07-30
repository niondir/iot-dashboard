/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Action from "../actionNames";
import Dashboard from "../dashboard";
import scriptloader from "../util/scriptLoader";
import * as PluginCache from "./pluginCache";
import * as _ from "lodash";
import * as URI from "urijs";


export function loadPlugin(plugin) {
    return addPlugin(plugin);
}


export function loadPluginFromUrl(url) {
    return function (dispatch) {
        scriptloader.loadScript([url], {success: () => onScriptLoaded(url, dispatch)});
    };
}

function onScriptLoaded(url, dispatch) {
    if (PluginCache.hasPlugin()) {
        // TODO: use a reference to the pluginCache and only bind that instance to the window object while the script is loaded
        // TODO: The scriploader can ensure that only one script is loaded at a time
        const plugin = PluginCache.popLoadedPlugin();

        const dependencies = plugin.TYPE_INFO.dependencies;
        if (_.isArray(dependencies) && dependencies.length !== 0) {

            const paths = dependencies.map(dependency => {
                return URI(dependency).absoluteTo(url).toString();
            });

            console.log("Loading Dependencies for Plugin", paths);

            scriptloader.loadScript(paths, {
                success: () => {
                    dispatch(addPlugin(plugin, url));
                }
            });
        }
        else {
            dispatch(addPlugin(plugin, url));
        }
    }
    else {
        console.error("Failed to load Plugin. Make sure it called window.iotDashboardApi.register***Plugin from url " + url);
    }
}


export function initializeExternalPlugins() {
    return (dispatch, getState) => {
        const state = getState();
        const plugins = _.valuesIn(state.datasourcePlugins)
            .concat(_.valuesIn(state.widgetPlugins));

        plugins.filter(pluginState => !_.isEmpty(pluginState.url)).forEach(plugin => {
            dispatch(loadPluginFromUrl(plugin.url));
        })
    }
}

/**
 * Register a plugin in the plugin registry
 */
function registerPlugin(plugin) {
    // TODO: I do not like that we use some singleton here to register widgets (there are other places as well)
    const dashboard = Dashboard.getInstance();
    
    if (plugin.Datasource) {
        dashboard.datasourcePluginRegistry.register(plugin);
    }
    else if (plugin.Widget) {
        dashboard.widgetPluginRegistry.register(plugin);
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
        const plugins = _.valuesIn(state.datasourcePlugins).concat(_.valuesIn(state.widgetPlugins));

        const existentPluginState = plugins.find(pluginState => {
            return plugin.TYPE_INFO.type === pluginState.typeInfo.type;
        });

        if (!existentPluginState) {
            let actionType = "unknown-add-widget-action";
            if (plugin.Datasource !== undefined) {
                actionType = Action.ADD_DATASOURCE_PLUGIN;
            }
            if (plugin.Widget !== undefined) {
                actionType = Action.ADD_WIDGET_PLUGIN;
            }

            // TODO: Just put the raw plugin + url here and let the reducer do the logic
            dispatch({
                type: actionType,
                id: plugin.TYPE_INFO.type, // needed for crud reducer
                typeInfo: plugin.TYPE_INFO,
                url
            });
        }


        // TODO: Maybe use redux sideeffect and move this call to the reducer
        registerPlugin(plugin);
    }
}
