import * as Redux from 'redux';
import thunk from 'redux-thunk'
import createLogger from 'redux-logger';
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts'
import * as Datasource from './datasource/datasource'
import * as Modal from './modal/modalDialog'
import * as Persist from './persistence'
import {reducer as formReducer} from 'redux-form';
import * as Action from './actionNames'

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

let reducer = Redux.combineReducers({
    widgets: importReducerFactory(Widgets.widgets, "widgets"),
    widgetConfig: WidgetConfig.widgetConfigDialog,
    layouts: Layouts.layouts,
    currentLayout: Layouts.currentLayout,
    datasources: importReducerFactory(Datasource.datasources, "datasources"),
    form: formReducer,
    modalDialog: Modal.modalDialog
});


const logger = createLogger({
    duration: false, // Print the duration of each action?
    timestamp: true, // Print the timestamp with each action?
    logErrors: true, // Should the logger catch, log, and re-throw errors?
    predicate: (getState, action) => {
        return !action.doNotLog;
        
    }
});

export default Redux.createStore(
    reducer,
    Persist.loadFromLocalStorage(),
    Redux.applyMiddleware(
        thunk,
        Persist.persistenceMiddleware,
        logger // must be last
    ));