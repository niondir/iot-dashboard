import * as Widgets from '../widgets/widgets'
import {valuesOf} from '../util/collection'
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
const layoutCrudReducer = genCrudReducer([ADD_LAYOUT, UPDATE_LAYOUT, DELETE_LAYOUT], layout, initialLayouts);
export function layouts(state = initialLayouts, action) {
    state = layoutCrudReducer(state, action);
    switch (state.type) {
        case "ADD_LAYOUT":
        default:
            return state;
    }
}

export function layout(state = initialLayouts, action) {
    switch (state.type) {
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