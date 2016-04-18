import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {Provider} from 'react-redux'
import Layout from './pageLayout'
import * as Persist from './widgets/persistence'
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
import * as TimeWidget from './widgets/plugins/timeWidget'
import * as TextWidget from './widgets/plugins/textWidget'
import * as ChartWidget from './widgets/chartWidget'
// Datasources
import DatasourcePlugins from './datasource/datasourcePlugins'
import * as RandomDatasource from './datasource/plugins/randomDatasource'
import * as TimeDatasource from './datasource/plugins/timeDatasource'

WidgetPlugins.register(TimeWidget);
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
    datasource: Datasource.datasources
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
