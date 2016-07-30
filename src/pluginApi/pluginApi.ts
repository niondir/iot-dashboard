/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as PluginCache from './pluginCache'

const pluginApi = {
    registerDatasourcePlugin: PluginCache.registerDatasourcePlugin,
    registerWidgetPlugin: PluginCache.registerWidgetPlugin
};

// TO be robust during tests in node and server side rendering
if (window) {
    (<any>window).iotDashboardApi = pluginApi;
}

export default pluginApi;