import * as Action from '../actionNames'

export const initialState = {
    isReadOnly: false
};


export function setReadOnly(isReadOnly) {
    return function (dispatch) {
        dispatch(setReadOnlyAction(isReadOnly));
    }
}

function setReadOnlyAction(isReadOnly) {
    return {
        type: Action.SET_READONLY,
        isReadOnly
    };

}


export function dashboard(state = initialState, action) {
    switch (action.type) {
        case Action.SET_READONLY:
            return Object.assign({}, state, {
                isReadOnly: action.isReadOnly
            });
        default:
            return state;
    }
}