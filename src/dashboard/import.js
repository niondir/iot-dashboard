import ModalDialog from '../ui/modal.ui'
import {DASHBOARD_IMPORT} from '../actionNames'
import {loadEmptyLayout} from '../layouts/layouts'

export function serialize(state) {
    return JSON.stringify({
        widgets: state.widgets
    });
}

export function deserialize(data) {
    let state;
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
            return dispatch({
                type: DASHBOARD_IMPORT,
                state
            })
        }, 0);
    }
}


