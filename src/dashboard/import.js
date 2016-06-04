import ModalDialog from '../modal/modalDialog.ui.js'
import {DASHBOARD_IMPORT} from '../actionNames'
import {loadEmptyLayout} from '../layouts/layouts'
import * as Plugins from '../pluginApi/plugins'
import * as _ from 'lodash'
import * as Action from '../actionNames'

/**
 * When using the importReducerFactory the action for loading the state will be implemented.
 * Additionally:
 * - You have to make sure that the property is saved on export
 * - Plus any action that is needed after the import has to be called
 * See: serialize() and doImport()
 * - And add the importReducerFactory to all state reducers of imported state
 * See: ../store.js
 */
export function importReducerFactory(baseReducer:Function, name) {
    console.assert(name, "Name parameter of importReducerFactory must not be empty");
    return importReducer.bind(this, baseReducer, name);
}

function importReducer(baseReducer:Function, name, state, action) {
    switch (action.type) {
        case Action.DASHBOARD_IMPORT:
            // TODO: Refactor import to work on root state and provide a list of all properties to be updated
            // Than we do not need the factory for every substate, but just once on root level

            let importState = action.state[name];
            if (importState) {
                return action.state[name];
            }
            else {
                return baseReducer(state, action);
            }
        default:
            return baseReducer(state, action);
    }
}


export function serialize(state) {
    return JSON.stringify({
        widgets: state.widgets,
        datasources: state.datasources,
        plugins: state.plugins
    });
}

export function deserialize(data) {
    if (typeof data === "string") {
        return JSON.parse(data);
    }
    else {
        throw new Error("Dashboard data for import must be of type string but is " + typeof data);
    }
}

export function doImport(data) {
    let state = deserialize(data);
    return function (dispatch) {
        // Bad hack to force the grid layout to update correctly
        dispatch(loadEmptyLayout());
        setTimeout(()=> {
            dispatch({
                type: DASHBOARD_IMPORT,
                state
            });
            dispatch(Plugins.initializeExternalPlugins())
        }, 0);
    }
}


