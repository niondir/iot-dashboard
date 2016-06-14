import WidgetPlugin from './widgetPlugin'
import PluginRegistry from '../pluginApi/pluginRegistry'
import * as Action from "../actionNames";
import {genCrudReducer} from "../util/reducer";
import {PropTypes as Prop}  from "react";


// TODO: Later load all plugins from external URL's ?
const initialState = {};

export const widgetPluginType = Prop.shape({
    id: Prop.string.isRequired,
    typeInfo: Prop.shape({
        type: Prop.string.isRequired,
        name: Prop.string.isRequired,
        settings: Prop.array
    })
});


class WidgetPluginRegistry extends PluginRegistry {

    createPluginFromModule(module) {
        return new WidgetPlugin(module, this.store);
    }
}


export const pluginRegistry = new WidgetPluginRegistry();

export function unloadPlugin(type) {
    return function(dispatch) {
        //TODO: Unloading plugins is work in progess
        //DatasourcePlugins
        dispatch(deletePlugin(type));
    }
}

function deletePlugin(type) {
    return {
        type: Action.DELETE_WIDGET_PLUGIN,
        id: type
    }
}

const pluginsCrudReducer = genCrudReducer([Action.ADD_WIDGET_PLUGIN, Action.DELETE_WIDGET_PLUGIN], widgetPlugin);
export function widgetPlugins(state = initialState, action) {

    state = pluginsCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }

}

function widgetPlugin(state, action) {
    switch (action.type) {
        case Action.ADD_WIDGET_PLUGIN:
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
