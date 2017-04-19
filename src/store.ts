/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Redux from "redux";
import thunk from "redux-thunk";
import * as createLogger from "redux-logger";
import * as Widgets from "./widgets/widgets";
import * as WidgetConfig from "./widgets/widgetConfig.js";
import * as Layouts from "./layouts/layouts.js";
import * as Datasource from "./datasource/datasource";
import * as Global from "./dashboard/global.js";
import * as Import from "./dashboard/import.js";
import * as Modal from "./modal/modalDialog.js";
import * as Persist from "./persistence.js";
import * as Plugins from './pluginApi/plugins'
import {reducer as formReducer} from "redux-form";
import * as Action from "./actionNames";
import * as  WidgetPlugins from "./widgets/widgetPlugins.js";
import * as DatasourcePlugins from "./datasource/datasourcePlugins";
import * as AppState from "./appState.ts";
import * as Config from "./config";
import Dashboard from "./dashboard";

export interface DashboardStore extends Redux.Store<AppState.State> {
    dashboard: Dashboard;
}


// TODO: name all reducers ***Reducer
const appReducer: AppState.Reducer = Redux.combineReducers<AppState.State>({
    config: Config.config,
    widgets: Widgets.widgets,
    widgetConfig: WidgetConfig.widgetConfigDialog,  // TODO: Still used or replaced by modalDialog
    layouts: Layouts.layouts,
    currentLayout: Layouts.currentLayout,
    datasources: Datasource.datasources,
    form: formReducer,
    modalDialog: Modal.modalDialog,
    pluginLoader: Plugins.pluginLoaderReducer,
    widgetPlugins: WidgetPlugins.widgetPlugins,
    datasourcePlugins: DatasourcePlugins.datasourcePlugins,
    global: Global.global
});

const reducer: AppState.Reducer = (state: AppState.State, action: Redux.Action) => {
    if (action.type === Action.CLEAR_STATE) {
        state = undefined
    }

    state = Import.importReducer(state, action);

    return appReducer(state, action);
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

export function emptyState() {
    return <AppState.State>{
        config: null,
        widgets: {},
        datasources: {},
        datasourcePlugins: {},
        widgetPlugins: {},
        pluginLoader: {
            loadingUrls: []
        }
    }
}

/**
 * Create a store as empty as possible
 */
export function createEmpty(options: any = {log: true}) {
    return create(emptyState(), options);
}


/**
 * Create a store with default values
 */
export function createDefault(options: any = {log: true}): DashboardStore {
    return create(undefined, options);
}

export function testStoreOptions() {
    return {log: false, persist: false}
}

export function defaultStoreOptions() {
    return {log: true, persist: true}
}

/**
 * Create a store and execute all side-effects to have a consistent app
 */
export function create(initialState?: AppState.State, options?: any): DashboardStore {
    if (!initialState) {
        initialState = <AppState.State>Persist.loadFromLocalStorage();
    }

    const middleware: Redux.Middleware[] = [];
    middleware.push(thunk);

    if (options.persist) {
        middleware.push(Persist.persistenceMiddleware);
    }
    if (options.log) {
        middleware.push(logger); // must be last
    }

    return <DashboardStore>Redux.createStore(
        reducer,
        initialState,
        Redux.applyMiddleware(...middleware)
    );
}

export function clearState(): Redux.Action {
    return {
        type: Action.CLEAR_STATE
    }
}
