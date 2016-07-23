/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Redux from "redux";
import thunk from "redux-thunk";
import * as createLogger from "redux-logger";
import * as Widgets from "./widgets/widgets";
import * as WidgetConfig from "./widgets/widgetConfig.js";
import * as Layouts from "./layouts/layouts.js";
import * as Datasource from "./datasource/datasource.js";
import * as Plugins from "./pluginApi/plugins.js";
import * as Dashboard from "./dashboard/dashboard.js";
import * as Import from "./dashboard/import.js";
import * as Modal from "./modal/modalDialog.js";
import * as Persist from "./persistence.js";
import {reducer as formReducer} from "redux-form";
import * as Action from "./actionNames.js";
import * as  WidgetPlugins from "./widgets/widgetPlugins.js";
import * as DatasourcePlugins from "./datasource/datasourcePlugins";
import * as AppState from "./appState.ts";
import * as Config from "./config";

export interface DashboardStore extends Redux.Store<AppState.State> {

}


const appReducer: AppState.Reducer = Redux.combineReducers<AppState.State>({
    config: Config.config,
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

let globalStore: DashboardStore;

export function setGlobalStore(store: DashboardStore) {
    globalStore = store;
}

export function get() {
    if (!globalStore) {
        throw new Error("No global store created. Call setGlobalStore(store) before!");
    }

    return globalStore;
}

export function emptyState() {
    return <AppState.State>{
        config: null,
        widgets: {},
        datasources: {},
        datasourcePlugins: {}
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
export function createDefault(options: any = {log: true}) {
    return create(undefined, options);
}


/**
 * Create a store and execute all side-effects to have a consistent app
 */
export function create(initialState?: AppState.State, options: any = {log: true}): DashboardStore {
    const middleware: Redux.Middleware[] = [];
    middleware.push(thunk);
    middleware.push(Persist.persistenceMiddleware);
    if (options.log) {
        middleware.push(logger); // must be last
    }

    const store = Redux.createStore(
        reducer,
        initialState,
        Redux.applyMiddleware(...middleware)
    );

    DatasourcePlugins.pluginRegistry.store = store;
    WidgetPlugins.pluginRegistry.store = store;

    store.dispatch(Plugins.initializeExternalPlugins());

    return store;
}

export function clearState(): Redux.Action {
    return {
        type: Action.CLEAR_STATE
    }
}
