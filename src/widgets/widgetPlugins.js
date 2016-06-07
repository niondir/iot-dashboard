import WidgetPlugin from './widgetPlugin'
import PluginRegistry from '../pluginApi/pluginRegistry'
import * as Action from "../actionNames";
import {genCrudReducer} from "../util/reducer";

// TODO: Later load all plugins from external URL's ?
const initialState = {};

class WidgetPluginRegistry extends PluginRegistry {

    createPluginFromModule(module) {
        return new WidgetPlugin(module, this.store);
    }
}



export const pluginRegistry = new WidgetPluginRegistry();



const pluginsCrudReducer = genCrudReducer([Action.ADD_PLUGIN, Action.DELETE_PLUGIN], widgetPlugin);
export function widgetPlugins(state = initialState, action) {
    if (action.pluginType !== 'widget') {
        return state;
    }
    
    state = pluginsCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }

}

function widgetPlugin(state, action) {
    switch (action.type) {
        case Action.ADD_PLUGIN:
            if (action.pluginType !== 'widget') {
                return state;
            }
            
            if (!action.typeInfo.type) {
                // TODO: Catch this earlier
                throw new Error("A Plugin needs a type name.");
            }

            return {
                id: action.typeInfo.type,
                url: action.url,
                typeInfo: action.typeInfo,
                isDatasource: action.pluginType === "datasource",
                isWidget: action.pluginType === "widget"
            };
        default:
            return state;
    }
}
