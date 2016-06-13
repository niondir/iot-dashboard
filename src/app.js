import _ from "lodash"
import "semantic-ui-css/semantic.css"
import "semantic-ui-css/semantic"
import "c3css"
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {Provider} from "react-redux"
import Layout from "./pageLayout"
import * as Widgets from "./widgets/widgets"
import * as WidgetPlugins from "./widgets/widgetPlugins"
import * as TextWidget from "./widgets/plugins/textWidget"
import * as ChartWidget from "./widgets/plugins/chartWidget"
import * as DatasourceWorker from "./datasource/datasourceWorker"
import * as RandomDatasource from "./datasource/plugins/randomDatasource"
import * as TimeDatasource from "./datasource/plugins/timeDatasource"
import store from "./store"
import * as Store from "./store"
import * as Plugins from "./pluginApi/plugins"
import "./pluginApi/freeboardPluginApi"
import "./pluginApi/pluginApi"

store.dispatch(Plugins.loadPlugin(TextWidget));
store.dispatch(Plugins.loadPlugin(ChartWidget));

store.dispatch(Plugins.loadPlugin(RandomDatasource));
store.dispatch(Plugins.loadPlugin(TimeDatasource));

store.dispatch(Plugins.initializeExternalPlugins());

// Would delete async loaded widgets that are not known yet.
//cleanupState(state);

//noinspection Eslint
function cleanupState(state) {
    _.valuesIn(state.widgets).forEach((widgetState) => {
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
        // TODO: Rendering of error message sux
        if (confirm("Failed to load dashboard. Reset all Data?\n\nPress cancel and check the browser console for more details.")) {
            store.dispatch(Store.clearState());
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


function renderDashboard(element, store) {
    ReactDOM.render(
        <Provider store={store}>
            <Layout/>
        </Provider>,
        element);

    DatasourceWorker.start();
}