/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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


export function global(state = initialState, action) {
    switch (action.type) {
        case Action.SET_READONLY:
            return Object.assign({}, state, {
                isReadOnly: action.isReadOnly
            });
        default:
            return state;
    }
}