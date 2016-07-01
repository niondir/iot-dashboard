import * as Redux from 'redux';
import  thunk from 'redux-thunk'
import * as createLogger from 'redux-logger';
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts'
import * as Datasource from './datasource/datasource'
import * as Dashboard from './dashboard/dashboard'
import * as Import from './dashboard/import'
import * as Modal from './modal/modalDialog'
import * as Persist from './persistence'
import {reducer as formReducer} from 'redux-form';
import * as Action from './actionNames'
import * as  WidgetPlugins from './widgets/widgetPlugins'
import * as DatasourcePlugins from './datasource/datasourcePlugins'

let store;


let appReducer = Redux.combineReducers({
    widgets: Widgets.widgets,
    widgetConfig: WidgetConfig.widgetConfigDialog,  // TODO: Still used or replaced by modalDialog
    layouts: Layouts.layouts,
    currentLayout: Layouts.currentLayout,
    datasources: Datasource.datasources,
    form: formReducer,
    modalDialog: Modal.modalDialog,
    widgetPlugins: WidgetPlugins.widgetPlugins,
    datasourcePlugins: DatasourcePlugins.datasourcePlugins,
    dashboard: Dashboard.dashboard
});

const reducer = (state, action) => {
    if (action.type === Action.CLEAR_STATE) {
        state = undefined
    }

    state = Import.importReducer(state, action);

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

DatasourcePlugins.pluginRegistry.store = store;
WidgetPlugins.pluginRegistry.store = store;

export function clearState() {
    return {
        type: Action.CLEAR_STATE
    }
}

export default store;
