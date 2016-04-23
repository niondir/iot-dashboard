import {assert} from 'chai'
import * as DatasourceWorker from './datasourceWorker'
import DatasourcePlugins from './datasourcePlugins'
import {genCrudReducer} from '../util/reducer'
import * as Action from '../actionNames'
import * as Uuid from '../util/uuid'
import {valuesOf} from '../util/collection'

const initialDatasources = {
    "initial_random_source": {
        id: "initial_random_source",
        type: "random",
        props: {
            name: "Random",
            min: 10,
            max: 20,
            maxValues: 20
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
        //const state = getState();
        //DatasourceWorker.initializeWorkers(state.datasources, dispatch);
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

export function appendDatasourceData(id, data) {
    return {
        type: Action.APPEND_DATASOURCE_DATA,
        id,
        data
    }
}

export function fetchDatasourceData() {
    return (dispatch, getState) => {
        const state = getState();
        const dsStates = state.datasources;
        
        valuesOf(dsStates).forEach(dsState => {
            const dsPlugin = DatasourcePlugins.getPlugin(dsState.type);
            const dsInstance = dsPlugin.getOrCreateInstance(dsState);
            const newData = dsInstance.getValues();

            /*
            if (!dsState.data) {
                const pastData = dsInstance.getPastValues();
                dispatch(setDatasourceData(dsState.id, pastData));
            }*/
            const action = setDatasourceData(dsState.id, newData);
            action.doNotLog = true;
            dispatch(action);
        })
    };
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
            return {
                ...state,
                data: action.data
            };
        case Action.APPEND_DATASOURCE_DATA:
            const stateData = state.data ||[];
            return {
                ...state,
                data: [...stateData, ...action.data]
            };
        default:
            return state;
    }
}