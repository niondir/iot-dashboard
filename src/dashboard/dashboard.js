import * as Action from '../actionNames'


const initialState = {
   isFullscreen: false
};


export function setFullscreen(isFullscreen) {
    return {
        type: Action.SET_FULLSCREEN,
        isFullscreen
    }
}

export function dashboard(state = initialState, action) {
    switch(action.type) {
        case Action.SET_FULLSCREEN:
            return {
                ...state,
                isFullscreen: action.isFullscreen
            };
        default:
            return state;
    }
}