import {assert} from 'chai'
import DatasourcePlugins from './datasourcePlugins'
import {genCrudReducer} from '../util/reducer'
import * as Action from '../actionNames'
import * as Uuid from '../util/uuid'

const initialDatasources = {
    "my-random": {
        id: "my-random",
        type: "random",
        props: {
            name: "Random Datasource"
        }
    }
};


export function addDatasource(dsType, props) {
    if (!dsType) {
        console.warn("dsType: ", dsType);
        console.warn("props: ", props);
        throw new Error("Can not add Datasource without Type");
    }

    return {
        type: Action.ADD_DATASOURCE,
        id: Uuid.generate(),
        dsType,
        props
    }
}

export function deleteDatasource(id) {
    return {
        type: Action.DELETE_DATASOURCE,
        id
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
                type: action.dsType,
                props: action.props
            };
        case Action.UPDATE_DATASOURCE:
        default:
            return state;
    }
}