import * as Widgets from '../widgets/widgets'
import {valuesOf} from '../util/collection'
import {generate as generateUuid} from '../util/uuid'
import {genCrudReducer} from '../util/reducer'

const initialLayouts = {
    "default": {
        id: "default",
        name: "Default Layout",
        widgets: Widgets.initialWidgets
    }
};

const ADD_LAYOUT = "ADD_LAYOUT";
const UPDATE_LAYOUT = "UPDATE_LAYOUT";
const DELETE_LAYOUT = "DELETE_LAYOUT";
const LOAD_LAYOUT = "LOAD_LAYOUT";

export function addLayout(name, widgets) {
    return {
        type: ADD_LAYOUT,
        id: generateUuid(),
        name,
        widgets
    }
}

const layoutCrudReducer = genCrudReducer([ADD_LAYOUT, UPDATE_LAYOUT, DELETE_LAYOUT], layout, initialLayouts);
export function layouts(state = initialLayouts, action) {
    state = layoutCrudReducer(state, action);
    switch (state.type) {
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
        default:
            return state;
    }
}