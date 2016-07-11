import * as Redux from 'redux';
import thunk from 'redux-thunk'
import * as createLogger from 'redux-logger';
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig.js'
import * as Layouts from './layouts/layouts.js'
import * as Datasource from './datasource/datasource.js'
import * as Dashboard from './dashboard/dashboard.js'
import * as Import from './dashboard/import.js'
import * as Modal from './modal/modalDialog.js'
import * as Persist from './persistence.js'
import {reducer as formReducer} from 'redux-form';
import * as Action from './actionNames.js'
import * as  WidgetPlugins from './widgets/widgetPlugins.js'
import * as DatasourcePlugins from './datasource/datasourcePlugins.js'
import * as AppState from './appState.ts'

export type DashboardStore = Redux.Store<AppState.State>;


let store: DashboardStore;


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

const reducer = (state: AppState.State, action: AppState.Action) => {
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

export function clearState(): Redux.Action {
    return {
        type: Action.CLEAR_STATE
    }
}

export default store;
