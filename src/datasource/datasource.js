import {assert} from 'chai'
import DatasourcePlugins from './datasourcePlugins'
import {genCrudReducer} from '../util/reducer'
import * as Action from '../actionNames'
import * as Uuid from '../util/uuid'

const initialDatasources = {
    "my-random": {
        id: "my-random",
        type: "random",
        name: "Random Datasource"
    }
};


export function addDatasource() {
    return {
         id: Uuid.generate()
    }
}

const datasourceCrudReducer = genCrudReducer([Action.ADD_DATASOURCE, Action.UPDATE_DATASOURCE, Action.DELETE_DATASOURCE], datasource);
export function datasources(state = initialDatasources, action) {
    state = datasourceCrudReducer(state, action);
    switch (action.type) {
        default:
            return state;
    }
}

function datasource(state, action) {
    switch (action.type) {
        case Action.ADD_DATASOURCE:
            return {
                id: action.id,
                type: action.type,
                name: action.type
            };
        case Action.UPDATE_DATASOURCE:
        default:
            return state;
    }
}