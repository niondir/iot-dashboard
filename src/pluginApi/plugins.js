import * as Action from '../actionNames'
import {genCrudReducer} from '../util/reducer'
import * as Uuid from '../util/uuid'
import DatasourcePlugins from '../datasource/datasourcePlugins'
import $script from 'scriptjs';


export function loadPlugin(url) {
    return function (dispatch) { // works with redux thunk plugin
        // TODO: Handle cases where a plugin with that type was already registered
        $script([url], () => {
            // We assume that the plugin has registered it self here.
            DatasourcePlugins.getPlugin(/*how to get the type oO*/)

            console.log("Loaded plugin from " + url);
            //dispatch(addPlugin(url));
        });


    };
}

export function addPlugin(url) {
    return {
        type: Action.ADD_PLUGIN,
        id: Uuid.generate(),
        url
    };
}


const pluginsCrudReducer = genCrudReducer([Action.ADD_PLUGIN, Action.DELETE_PLUGIN], plugin);
export function plugins(state, action) {
    state = pluginsCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }

}

function plugin(state, action) {
    switch (action.type) {
        case Action.ADD_PLUGIN:
            return {
                id: action.id, // Type as id?
                url: action.url
                // TODO: reference to datasource or widget plugin type?
            };
        default:
            return state;
    }

}