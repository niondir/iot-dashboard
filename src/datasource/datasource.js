import {assert} from 'chai'
import * as DatasourceWorker from './datasourceWorker'
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

    

    return function (dispatch, getState) {
        dispatch({
            type: Action.ADD_DATASOURCE,
            id: Uuid.generate(),
            dsType,
            props
        });
        const state = getState();
        DatasourceWorker.updateWorkers(state.datasources, dispatch);
    }
}

export function deleteDatasource(id) {
    return {
        type: Action.DELETE_DATASOURCE,
        id
    }
}

export function setDatasourceData(id, data) {
    return {
        type: Action.SET_DATASOURCE_DATA,
        id,
        data
    }
}

const datasourceCrudReducer = genCrudReducer([Action.ADD_DATASOURCE, Action.DELETE_DATASOURCE], datasource);
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
        case Action.SET_DATASOURCE_DATA:
            console.log("Setting data to: ", action.data);
            return {
                ...state,
                data: action.data
            };
        default:
            return state;
    }
}