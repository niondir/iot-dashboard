import * as Widgets from '../widgets/widgets'

const initialLayouts = {
  "default": {
      id: "default",
      name: "Default Layout",
      widgets: Widgets.initialWidgets
  }
};


export function layouts(state = initialLayouts, action) {
    let newState;
    switch(state.type) {
        case "ADD_LAYOUT":
            return {...state, [action.id]: layout(undefined, action)};
        default:
            return state;
    }
}
export function layout(state = initialLayouts, action) {
    switch(state.type) {
        case "ADD_LAYOUT":
            return {
                id: action.id,
                name: action.name,
                widgets: action.widgets
            };
        default:
            return state;
    }
}