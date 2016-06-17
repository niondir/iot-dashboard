import * as DatasourcePlugins from './datasourcePlugins'
import {genCrudReducer} from '../util/reducer'
import * as Action from '../actionNames'
import * as Uuid from '../util/uuid'
import _ from 'lodash'
import * as ModalIds from '../modal/modalDialogIds'
import * as Modal from '../modal/modalDialog'

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

export function createOrUpdateDatasource(id, type, props) {
    return (dispatch, getState) => {
        const state = getState();

        const dsState = state.datasources[id];

        if (dsState && dsState.type !== type) {
            throw new Error("Can not update datasource of type " + dsState.type + " with props of type " + type);
        }
        if (dsState) {
            dispatch(updateDatasourceProps(id, props));
        }
        else {
            dispatch(addDatasource(type, props));
        }
    }
}


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

export function updateDatasourceProps(id, props) {
    return {
        type: Action.UPDATE_DATASOURCE,
        id,
        props
    }
}

export function startCreateDatasource() {
    return Modal.showModal(ModalIds.DATASOURCE_CONFIG);
}
export function startEditDatasource(id) {
    return function (dispatch, getState) {
        // TODO: This show dialog stuff should be hanbdles with actions as well. Not as Side effects.
        //DatasourceConfigDialog.showDialog();
        const state = getState();
        const dsState = state.datasources[id];
        dispatch(Modal.showModal(ModalIds.DATASOURCE_CONFIG, {datasource: dsState}));
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

        _.valuesIn(dsStates).forEach(dsState => {
            const dsFactory = DatasourcePlugins.pluginRegistry.getPlugin(dsState.type);

            if (dsFactory === undefined) {
                console.warn("Can not fetch data from non existent datasource plugin of type ", dsState.type);
                return;
            }

            const dsInstance = dsFactory.getOrCreateInstance(dsState.id);
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
        case Action.DELETE_DATASOURCE_PLUGIN: // Also delete related datasources
            const toDelete =_.valuesIn(state).filter(dsState => {
                return dsState.type == action.id
            });
            var newState = {...state};
            toDelete.forEach(dsState => {
                delete newState[dsState.id];
            });
            
            return newState;
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
            const stateData = state.data || [];
            return {
                ...state,
                data: [...stateData, ...action.data]
            };
        case Action.UPDATE_DATASOURCE:
            return {
                ...state,
                props: action.props
            };
        default:
            return state;
    }
}