import 'semantic-ui-css/semantic.css'
import 'semantic-ui-css/semantic'
import 'c3css'

import * as React from 'react'
import * as _ from 'lodash'
import * as Renderer from './renderer.js'
import * as Widgets from './widgets/widgets'
import * as WidgetPlugins from './widgets/widgetPlugins.js'
import * as TextWidget from './widgets/plugins/textWidget.js'
import * as ChartWidget from './widgets/plugins/chartWidget.js'
import * as DatasourceWorker from './datasource/datasourceWorker.js'
import * as RandomDatasource from './datasource/plugins/randomDatasource.js'
import * as TimeDatasource from './datasource/plugins/timeDatasource.js'
import store from './store'
import * as Store from './store'
import * as Plugins from './pluginApi/plugins.js'

import 'expose?$!expose?jQuery!jquery'
import 'expose?React!react'
import 'expose?_!lodash'
import './pluginApi/freeboardPluginApi'
import './pluginApi/pluginApi'
import './app.css'
import 'file?name=[name].[ext]!./index.html'

interface IWidgetState {
    id: string
    type: string
}

interface IState {
    widgets: IWidgetState
}


function loadInitialPlugins(store:Redux.Store) {

    store.dispatch(Plugins.loadPlugin(TextWidget));
    store.dispatch(Plugins.loadPlugin(ChartWidget));
    store.dispatch(Plugins.loadPluginFromUrl("./plugins/GoogleMapsWidget.js"));

    store.dispatch(Plugins.loadPlugin(RandomDatasource));
    store.dispatch(Plugins.loadPlugin(TimeDatasource));
    store.dispatch(Plugins.loadPluginFromUrl("./plugins/DigimondoGpsDatasource.js"));

    store.dispatch(Plugins.initializeExternalPlugins());
}

loadInitialPlugins(store);

// Would delete async loaded widgets that are not known yet.
//cleanupState(state);

//noinspection Eslint
function cleanupState(state: IState) {
    _.valuesIn(state.widgets).forEach((widgetState: IWidgetState) => {
        let widgetPlugin = WidgetPlugins.pluginRegistry.getPlugin(widgetState.type);
        if (!widgetPlugin) {
            console.error("No WidgetPlugin for type '" + widgetState.type + "'! Deleting the widget.");
            store.dispatch(Widgets.deleteWidget(widgetState.id));
            return null;
        }
    });
}

let element = document.getElementById('app');

if (element) {
    try {
        renderDashboard(element, store);
    }
    catch (e) {
        console.warn("Failed to load dashboard. Asking user to wipe data and retry. The error will be printed below...");
        if (confirm("Failed to load dashboard. Reset all Data?\n\nPress cancel and check the browser console for more details.")) {
            store.dispatch(Store.clearState());
            loadInitialPlugins(store);
            renderDashboard(element, store);
        }
        else {
            throw e;
        }
    }
}
else {
    console.warn("Can not get element '#app' from DOM. Okay for headless execution.");
}


function renderDashboard(element:Element, store:Redux.Store) {
    Renderer.render(element, store);
    DatasourceWorker.start();
}