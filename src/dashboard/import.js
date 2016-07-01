import * as Action from "../actionNames";
import {DASHBOARD_IMPORT} from "../actionNames";
import {loadEmptyLayout} from "../layouts/layouts";
import * as Plugins from "../pluginApi/plugins";

/**
 * To extend the import/export by another property you just need to add the property to the exported data
 * See: serialize()
 *
 * If there are any action needed after a property got imported, call them after the import.
 * See: afterImport()
 */

export function serialize(state) {
    return JSON.stringify({
        widgets: state.widgets,
        datasources: state.datasources,
        plugins: state.plugins
    });
}

function afterImport(dispatch, getState) {
    dispatch(Plugins.initializeExternalPlugins());
}

export function importReducer(state, action) {
    switch (action.type) {
        case Action.DASHBOARD_IMPORT:
            let newState = Object.assign({}, state, action.state);
            console.log("new State:", state, action.state, newState)
            return newState;
        default:
            return state
    }
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
    return function (dispatch, getState) {
        // Bad hack to force the grid layout to update correctly
        dispatch(loadEmptyLayout());
        setTimeout(()=> {
            dispatch({
                type: DASHBOARD_IMPORT,
                state
            });
            afterImport(dispatch, getState);
        }, 0);
    }
}


