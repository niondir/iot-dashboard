/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Action from "../actionNames";


export function loadPlugin(plugin) {
    return addPlugin(plugin);
}

export function setIsLoading(id:string, isLoading:boolean) {
    return {
        type: Action.PLUGIN_IS_LOADING,
        id,
        isLoading
    }
}

export function addPlugin(plugin, url = null) {
    console.log("Adding plugin from " + url, plugin);

    let actionType = "unknown-add-widget-action";
    if (plugin.Datasource !== undefined) {
        actionType = Action.ADD_DATASOURCE_PLUGIN;
    }
    if (plugin.Widget !== undefined) {
        actionType = Action.ADD_WIDGET_PLUGIN;
    }

    // TODO: Just put the raw plugin + url here and let the reducer do the logic
    return {
        type: actionType,
        id: plugin.TYPE_INFO.type, // needed for crud reducer
        typeInfo: plugin.TYPE_INFO,
        url
    };

}
