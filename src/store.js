import * as Redux from 'redux';
import thunk from 'redux-thunk'
import createLogger from 'redux-logger';
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts'
import * as Datasource from './datasource/datasource'
import * as Modal from './modal/modalDialog'
import * as Persist from './persistence'
import * as Plugins from './pluginApi/plugins'
import {reducer as formReducer} from 'redux-form';
import * as Action from './actionNames'
import WidgetPlugins from './widgets/widgetPlugins'
import DatasourcePlugins from './datasource/datasourcePlugins'

let store;


function importReducerFactory(baseReducer:Function, name) {
    return importReducer.bind(this, baseReducer, name);
}

function importReducer(baseReducer:Function, name, state, action) {
    switch (action.type) {
        case Action.DASHBOARD_IMPORT:
            return action.state[name];
        default:
            return baseReducer(state, action);
    }
}

let appReducer = Redux.combineReducers({
    widgets: importReducerFactory(Widgets.widgets, "widgets"),
    widgetConfig: WidgetConfig.widgetConfigDialog,
    layouts: Layouts.layouts,
    currentLayout: Layouts.currentLayout,
    datasources: importReducerFactory(Datasource.datasources, "datasources"),
    form: formReducer,
    modalDialog: Modal.modalDialog,
    plugins: Plugins.plugins
});

const reducer = (state, action) => {
    if (action.type === Action.CLEAR_STATE) {
        state = undefined
    }

    return appReducer(state, action)
};


const logger = createLogger({
    duration: false, // Print the duration of each action?
    timestamp: true, // Print the timestamp with each action?
    logErrors: true, // Should the logger catch, log, and re-throw errors?
    predicate: (getState, action) => {
        let foo = "";
        if (action.type.startsWith("redux-form")) {
            return false;
        }

        return !action.doNotLog;

    }
});

store = Redux.createStore(
    reducer,
    Persist.loadFromLocalStorage(),
    Redux.applyMiddleware(
        thunk,
        Persist.persistenceMiddleware,
        logger // must be last
    ));

DatasourcePlugins.store = store;
WidgetPlugins.store = store;

export function clearState() {
    return {
        type: Action.CLEAR_STATE
    }
}

export default store;
