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
import * as Counter from './exampleCounter'
import * as WidgetTypes from './widgets/widgetTypes'
import * as WidgetConfig from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts'
import {DASHBOARD_IMPORT} from './actionNames'
// Widgets
import * as TimeWidget from './widgets/timeWidget'
import * as TextWidget from './widgets/textWidget'
import * as ChartWidget from './widgets/chartWidget'


Widgets.register(TimeWidget);
Widgets.register(TextWidget);
Widgets.register(ChartWidget);

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
    counter: Counter.reducer,
    widgets: importReducerFactory(Widgets.widgets),
    widgetTypes: WidgetTypes.widgetTypes, //TODO: Unused?
    widgetConfig: WidgetConfig.widgetConfigDialog,
    layouts: Layouts.layouts,
    currentLayout: Layouts.currentLayout
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

ReactDOM.render(
    <Provider store={store}>
        <Layout/>
    </Provider>,
    document.getElementById('app'));
