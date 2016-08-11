/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import 'semantic-ui-css/semantic.css'
import 'semantic-ui-css/semantic'
import 'c3css'
import 'expose?$!expose?jQuery!jquery'
import 'expose?React!react'
import 'expose?_!lodash'
import './pluginApi/freeboardPluginApi'
import './pluginApi/pluginApi'
import './app.css'
import 'file?name=[name].[ext]!./index.html'
import 'es6-promise'

import * as Renderer from './renderer.js'
import * as TextWidget from './widgets/plugins/textWidget.js'
import * as ChartWidget from './widgets/plugins/chartWidget.js'
import * as DatasourceWorker from './datasource/datasourceWorker.js'
import * as RandomDatasource from './datasource/plugins/randomDatasource.js'
import * as TimeDatasource from './datasource/plugins/timeDatasource.js'
import * as Store from './store'
import * as Plugins from './pluginApi/plugins.js'
import * as Persist from "./persistence.js";

const initialState = Persist.loadFromLocalStorage();
const dashboardStore = Store.create(initialState);
Store.setGlobalStore(dashboardStore);

function loadInitialPlugins(store: Store.DashboardStore) {
    store.dispatch(Plugins.loadPlugin(TextWidget));
    store.dispatch(Plugins.loadPlugin(ChartWidget));
    store.dispatch(Plugins.loadPluginFromUrl("./plugins/GoogleMapsWidget.js"));

    store.dispatch(Plugins.loadPlugin(RandomDatasource));
    store.dispatch(Plugins.loadPlugin(TimeDatasource));
    store.dispatch(Plugins.loadPluginFromUrl("./plugins/DigimondoGpsDatasource.js"));

    store.dispatch(Plugins.initializeExternalPlugins());
}

loadInitialPlugins(dashboardStore);

const appElement = document.getElementById('app');

if (appElement) {
    try {
        renderDashboard(appElement, dashboardStore);
    }
    catch (e) {
        console.warn("Failed to load dashboard. Asking user to wipe data and retry. The error will be printed below...");
        if (confirm("Failed to load dashboard. Reset all Data?\n\nPress cancel and check the browser console for more details.")) {
            dashboardStore.dispatch(Store.clearState());
            loadInitialPlugins(dashboardStore);
            renderDashboard(appElement, dashboardStore);
        }
        else {
            throw e;
        }
    }
}
else {
    console.warn("Can not get element '#app' from DOM. Okay for headless execution.");
}


function renderDashboard(element: Element, store: Store.DashboardStore) {
    Renderer.render(element, store);
    DatasourceWorker.start();
}
