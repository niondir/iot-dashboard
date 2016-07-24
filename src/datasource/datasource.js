/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as DatasourcePlugins from './datasourcePlugins'
import {genCrudReducer} from '../util/reducer'
import * as Action from '../actionNames'
import * as Uuid from '../util/uuid'
import * as _ from 'lodash'
import * as ModalIds from '../modal/modalDialogIds'
import * as Modal from '../modal/modalDialog'

const initialDatasources = {
    "initial_random_source": {
        id: "initial_random_source",
        type: "random",
        settings: {
            name: "Random",
            min: 10,
            max: 20,
            maxValues: 20
        }
    }
};

export function createOrUpdateDatasource(id, type, settings) {
    return (dispatch, getState) => {
        const state = getState();

        const dsState = state.datasources[id];

        if (dsState && dsState.type !== type) {
            throw new Error("Can not update datasource of type " + dsState.type + " with props of type " + type);
        }
        if (dsState) {
            dispatch(updateDatasourceSettings(id, settings));
        }
        else {
            dispatch(addDatasource(type, settings));
        }
    }
}


export function addDatasource(dsType, settings) {
    if (!dsType) {
        console.warn("dsType: ", dsType);
        console.warn("settings: ", settings);
        throw new Error("Can not add Datasource without Type");
    }

    return function (dispatch, getState) {
        dispatch({
            type: Action.ADD_DATASOURCE,
            id: Uuid.generate(),
            dsType,
            settings
        });
        //const state = getState();
        //DatasourceWorker.initializeWorkers(state.datasources, dispatch);
    }
}

export function updateDatasourceSettings(id, settings) {
    // TODO: Working on that copy does not work yet. We need to notify the Datasource about updated settings!
    //let settingsCopy = {...settings};
    return {
        type: Action.UPDATE_DATASOURCE,
        id,
        settings
    }
}

export function startCreateDatasource() {
    return Modal.showModal(ModalIds.DATASOURCE_CONFIG);
}
export function startEditDatasource(id) {
    return function (dispatch, getState) {
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
            let newData = dsInstance.getValues();
            if (!_.isArray(newData)) {
                throw new Error("A datasource must return an array on getValues");
                // TODO: Also check that all elements of the array are objects?
            }
            else {
                // Copy data to make sure we do not work on a reference!
                newData = [...newData];
            }

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
            const toDelete = _.valuesIn(state).filter(dsState => {
                return dsState.type == action.id
            });
            const newState = Object.assign({}, state);
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
                settings: action.settings,
                data: []
            };
        case Action.SET_DATASOURCE_DATA:
            return Object.assign({}, state, {
                data: action.data || []
            });
        case Action.UPDATE_DATASOURCE:
            return Object.assign({}, state, {
                settings: action.settings
            });
        default:
            return state;
    }
}