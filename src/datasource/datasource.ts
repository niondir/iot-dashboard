/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as DatasourcePlugins from './datasourcePlugins'
import {genCrudReducer} from '../util/reducer.js'
import * as ActionNames from '../actionNames'
import * as Uuid from '../util/uuid.js'
import * as _ from 'lodash'
import * as ModalIds from '../modal/modalDialogIds.js'
import * as Modal from '../modal/modalDialog.js'
import * as AppState from "../appState";
import Dashboard from "../dashboard";

const initialDatasources: IDatasourcesState = {
    "initial_random_source": {
        id: "initial_random_source",
        type: "random",
        settings: {
            name: "Random",
            min: 10,
            max: 20,
            maxValues: 20
        },
        data: []
    }
};

export interface IDatasourceAction extends AppState.Action {
    id?: string
    data?: any[]
    settings?: any
    dsType?: string
}

export interface IDatasourcesState {
    [id: string]: IDatasourceState
}

export interface IDatasourceState {
    id: string
    type: string
    settings: any
    data: any[];
}

export function createDatasource(type: string, settings: any, id: string = Uuid.generate()): AppState.ThunkAction {
    return addDatasource(type, settings, id);
}

export function updateDatasource(id: string, type: string, settings: any): AppState.ThunkAction {
    return (dispatch, getState) => {
        const state = getState();

        const dsState = state.datasources[id];
        if (!dsState) {
            throw new Error("Failed to update not existing datasource of type '" + type + "' with id '" + id + "'");
        }
        if (dsState.type !== type) {
            throw new Error("Can not update datasource of type '" + dsState.type + "' with props of type '" + type + "'");
        }
        dispatch(updateDatasourceSettings(id, settings));

    }
}


export function addDatasource(dsType: string, settings: any, id: string = Uuid.generate()): AppState.ThunkAction {
    if (!dsType) {
        console.warn("dsType: ", dsType);
        console.warn("settings: ", settings);
        throw new Error("Can not add Datasource without Type");
    }

    return function (dispatch, getState) {
        dispatch({
            type: ActionNames.ADD_DATASOURCE,
            id,
            dsType,
            settings
        });

        const dsFactory = Dashboard.getInstance().datasourcePluginRegistry.getPlugin(dsType);
        dsFactory.createInstance(id);
    }
}

export function updateDatasourceSettings(id: string, settings: any) {
    // TODO: Working on that copy does not work yet. We need to notify the Datasource about updated settings!
    //let settingsCopy = {...settings};
    return {
        type: ActionNames.UPDATE_DATASOURCE,
        id,
        settings
    }
}

export function startCreateDatasource() {
    return Modal.showModal(ModalIds.DATASOURCE_CONFIG);
}
export function startEditDatasource(id: string): AppState.ThunkAction {
    return function (dispatch, getState) {
        const state = getState();
        const dsState = state.datasources[id];
        dispatch(Modal.showModal(ModalIds.DATASOURCE_CONFIG, {datasource: dsState}));
    }
}

export function deleteDatasource(id: string): IDatasourceAction {
    return {
        type: ActionNames.DELETE_DATASOURCE,
        id
    }
}

export function setDatasourceData(id: string, data: any[]): IDatasourceAction {
    return {
        type: ActionNames.SET_DATASOURCE_DATA,
        id,
        data
    }
}

export function fetchDatasourceData(): AppState.ThunkAction {
    return (dispatch, getState) => {
        const state = getState();
        const dsStates = state.datasources;

        _.valuesIn<IDatasourceState>(dsStates).forEach(dsState => {
            const dsFactory = Dashboard.getInstance().datasourcePluginRegistry.getPlugin(dsState.type);

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


const datasourceCrudReducer = genCrudReducer([ActionNames.ADD_DATASOURCE, ActionNames.DELETE_DATASOURCE], datasource);
export function datasources(state: IDatasourcesState = initialDatasources, action: IDatasourceAction): IDatasourcesState {
    state = datasourceCrudReducer(state, action);
    switch (action.type) {
        case ActionNames.DELETE_DATASOURCE_PLUGIN: // Also delete related datasources
            const toDelete = _.valuesIn<IDatasourceState>(state).filter(dsState => {
                return dsState.type === action.id
            });
            const newState = _.assign<any, IDatasourcesState>({}, state);
            toDelete.forEach(dsState => {
                delete newState[dsState.id];
            });

            return newState;
        default:
            return state;
    }
}

function datasource(state: IDatasourceState, action: IDatasourceAction): IDatasourceState {
    switch (action.type) {
        case ActionNames.ADD_DATASOURCE:
            return {
                id: action.id,
                type: action.dsType,
                settings: action.settings,
                data: []
            };
        case ActionNames.SET_DATASOURCE_DATA:
            return _.assign<any, IDatasourceState>({}, state, {
                data: action.data || []
            });
        case ActionNames.UPDATE_DATASOURCE:
            return _.assign<any, IDatasourceState>({}, state, {
                settings: action.settings
            });
        default:
            return state;
    }
}