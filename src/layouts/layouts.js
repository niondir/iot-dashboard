import * as Widgets from '../widgets/widgets'
import {generate as generateUuid} from '../util/uuid'
import {genCrudReducer} from '../util/reducer'
import {ADD_LAYOUT, LOAD_LAYOUT, UPDATE_LAYOUT, DELETE_LAYOUT, SET_CURRENT_LAYOUT} from '../actionNames'

const initialLayouts = {
    "default": {
        id: "default",
        name: "Default Layout",
        widgets: Widgets.initialWidgets
    }
};

export function addLayout(name, widgets) {
    return (dispatch) => {


        let addLayout = dispatch({
            type: ADD_LAYOUT,
            id: generateUuid(),
            name,
            widgets
        });

        dispatch(setCurrentLayout(addLayout.id));
    }

}

export function updateLayout(id, widgets) {
    return {
        type: UPDATE_LAYOUT,
        id,
        widgets
    }
}


export function deleteLayout(id) {
    return {
        type: DELETE_LAYOUT,
        id
    }
}

export function setCurrentLayout(id) {
    return {
        type: SET_CURRENT_LAYOUT,
        id
    }
}

export function loadEmptyLayout() {
    return {
        type: LOAD_LAYOUT,
        layout: {
            id: "empty",
            widgets: {}
        }
    };
}

export function loadLayout(id) {
    return (dispatch, getState) => {
        const state = getState();

        const layout = state.layouts[id];
        // Bad hack to force the grid layout to update correctly
        dispatch(loadEmptyLayout());

        if (!layout) {
            return;
        }
        setTimeout(()=> {
            dispatch(setCurrentLayout(layout.id));
            dispatch({
                type: LOAD_LAYOUT,
                layout
            });
        }, 0);
    }
}

const layoutCrudReducer = genCrudReducer([ADD_LAYOUT, DELETE_LAYOUT], layout);
export function layouts(state = initialLayouts, action) {
    state = layoutCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }
}

export function layout(state, action) {
    switch (action.type) {
        case ADD_LAYOUT:
            return {
                id: action.id,
                name: action.name,
                widgets: action.widgets
            };
        case UPDATE_LAYOUT:
            return {
                ...state,
                widgets: action.widgets
            };
        default:
            return state;
    }
}

export function currentLayout(state = {}, action) {
    switch (action.type) {
        case SET_CURRENT_LAYOUT:
            return {
                ...state,
                id: action.id
            };
        case DELETE_LAYOUT:
            if (action.id == state.id) {
                return {
                    ...state,
                    id: undefined
                }
            }
            return state;
        default:
            return state;
    }
}