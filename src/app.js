import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {Provider} from 'react-redux'
import {reducer as formReducer} from 'redux-form';
import Layout from './pageLayout'
import * as Persist from './persistence'
// Css
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic';
import 'c3css';
// Redux Middleware
import createLogger from 'redux-logger';
import thunk from 'redux-thunk'
// Reducers
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts'
import * as Datasource from './datasource/datasource'
import {DASHBOARD_IMPORT} from './actionNames'
// Widgets
import WidgetPlugins from './widgets/widgetPlugins'
import * as TextWidget from './widgets/plugins/textWidget'
import * as ChartWidget from './widgets/plugins/chartWidget'
// Datasources
import * as DatasourceWorker from './datasource/datasourceWorker'
import DatasourcePlugins from './datasource/datasourcePlugins'
import * as RandomDatasource from './datasource/plugins/randomDatasource'
import * as TimeDatasource from './datasource/plugins/timeDatasource'

WidgetPlugins.register(TextWidget);
WidgetPlugins.register(ChartWidget);


DatasourcePlugins.register(RandomDatasource);
DatasourcePlugins.register(TimeDatasource);



function importReducerFactory(baseReducer:Function) {
    return importReducer.bind(this, baseReducer);
}

function importReducer(baseReducer:Function, state, action) {
    switch (action.type) {
        case DASHBOARD_IMPORT:
            return action.state.widgets;
        default:
            return baseReducer(state, action);
    }
}

let reducer = Redux.combineReducers({
    widgets: importReducerFactory(Widgets.widgets),
    widgetConfig: WidgetConfig.widgetConfigDialog,
    layouts: Layouts.layouts,
    currentLayout: Layouts.currentLayout,
    datasources: Datasource.datasources,
    form: formReducer
});

const logger = createLogger();
let store = Redux.createStore(
    reducer,
    Persist.loadFromLocalStorage(),
    Redux.applyMiddleware(
        thunk,
        Persist.persistenceMiddleware,
        logger // must be last
    ));

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
