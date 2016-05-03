import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {Provider} from 'react-redux'
import {reducer as formReducer} from 'redux-form';
import Layout from './pageLayout'
import {valuesOf} from './util/collection'
import * as Persist from './persistence'
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic';
import 'c3css';
import createLogger from 'redux-logger';
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts'
import * as Datasource from './datasource/datasource'
import * as Modal from './modal/modalDialog'
import {DASHBOARD_IMPORT} from './actionNames'
import WidgetPlugins from './widgets/widgetPlugins'
import * as TextWidget from './widgets/plugins/textWidget'
import * as ChartWidget from './widgets/plugins/chartWidget'
import * as DatasourceWorker from './datasource/datasourceWorker'
import DatasourcePlugins from './datasource/datasourcePlugins'
import * as RandomDatasource from './datasource/plugins/randomDatasource'
import * as TimeDatasource from './datasource/plugins/timeDatasource'
import store from './store'


const state = store.getState();


WidgetPlugins.store = store;
WidgetPlugins.register(TextWidget);
WidgetPlugins.register(ChartWidget);

DatasourcePlugins.store = store;
DatasourcePlugins.register(RandomDatasource);
DatasourcePlugins.register(TimeDatasource);

cleanupState();

function cleanupState() {
    valuesOf(state.widgets).forEach((widgetState) => {
        let widgetPlugin = WidgetPlugins.getPlugin(widgetState.type);
        if (!widgetPlugin) {
            console.error("No WidgetPlugin for type '" + widgetState.type + "'! Deleting the widget.");
            store.dispatch(Widgets.deleteWidget(widgetState.id));
            return null;
        }
    });
}

DatasourceWorker.initializeWorkers(store.getState().datasources, store.dispatch);


let element = document.getElementById('app');

if (element) {
    ReactDOM.render(
        <Provider store={store}>
            <Layout/>
        </Provider>,
        element);
}
else {
    console.warn("Can not get element '#app' from DOM. Okay for headless execution.");
}
