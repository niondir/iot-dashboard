/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {genCrudReducer} from "../util/reducer.js";
import * as ActionNames from "../actionNames";
import * as Uuid from "../util/uuid.js";
import * as _ from "lodash";
import * as ModalIds from "../modal/modalDialogIds.js";
import * as Modal from "../modal/modalDialog.js";
import * as AppState from "../appState";

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
        data: [],
        isLoading: true
    }
};

export interface IDatasourceAction extends AppState.Action {
    id?: string
    data?: any[]
    settings?: any
    dsType?: string
    maxValues?: number
    isLoading?: boolean
    doNotPersist?: boolean
}

export interface IDatasourcesState {
    [id: string]: IDatasourceState
}

export interface IDatasourceState {
    id: string
    type: string
    settings: any
    data: any[]
    isLoading: boolean
}

export function createDatasource(type: string, settings: any, id: string = Uuid.generate()): IDatasourceAction {
    return addDatasource(type, settings, true, id);
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

export function finishedLoading(id: string) {
    return {
        type: ActionNames.DATASOURCE_FINISHED_LOADING,
        id
    };
}

export function addDatasource(dsType: string, settings: any, isLoading: boolean = true, id: string = Uuid.generate()): IDatasourceAction {
    if (!dsType) {
        console.warn("dsType: ", dsType);
        console.warn("settings: ", settings);
        throw new Error("Can not add Datasource without Type");
    }

    return {
        type: ActionNames.ADD_DATASOURCE,
        id,
        dsType,
        settings,
        isLoading
    };
}

export function updateDatasourceSettings(id: string, settings: any): IDatasourceAction {
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
        data,
        doNotLog: true
    }
}

export function appendDatasourceData(id: string, data: any[], maxValues: number = 10): IDatasourceAction {
    return {
        type: ActionNames.APPEND_DATASOURCE_DATA,
        id,
        data,
        maxValues,
        doNotLog: true,
        doNotPersist: true
    }
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
                data: [],
                isLoading: true
            };
        case ActionNames.SET_DATASOURCE_DATA:
            return _.assign<any, IDatasourceState>({}, state, {
                data: action.data || []
            });
        case ActionNames.APPEND_DATASOURCE_DATA:
            let newData = _.clone(state.data).concat(action.data);
            if (action.maxValues) {
                newData = _.takeRight(newData, action.maxValues);
            }
            return _.assign<any, IDatasourceState>({}, state, {
                data: newData
            });
        case ActionNames.UPDATE_DATASOURCE:
            return _.assign<any, IDatasourceState>({}, state, {
                settings: action.settings
            });
        case ActionNames.DATASOURCE_FINISHED_LOADING:
            let newState = _.assign<any, IDatasourceState>({}, state);
            newState.isLoading = false;
            return newState;
        default:
            return state;
    }
}