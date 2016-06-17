import * as Action from '../actionNames'
//import * as Fullscreen from 'screenfull'

export const initialState = {
    isFullscreen: false
};

  

export function setFullscreen(isFullscreen) {
    return function (dispatch) {
        dispatch(setFullscreenAction(isFullscreen));
        /*
        if (Fullscreen.enabled && isFullscreen) {
            console.log("requesting fullscreen")
            Fullscreen.request();
        }
        else if (Fullscreen.enabled && isFullscreen) {
            Fullscreen.exit();
        }   */
    }
}

function setFullscreenAction(isFullscreen) {
    return {
        type: Action.SET_FULLSCREEN,
        isFullscreen
    };
    
}


export function dashboard(state = initialState, action) {
    switch (action.type) {
        case Action.SET_FULLSCREEN:
            return {
                ...state,
                isFullscreen: action.isFullscreen
            };
        default:
            return state;
    }
}