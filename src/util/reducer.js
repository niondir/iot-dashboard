/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as _ from 'lodash'

/**
 * Creates an reducer that works on an object where you can create, delete and update properties of type Object.
 * The key of properties always matches the id property of the value object.
 *
 * @param actionNames
 * Object with: create, update, delete action names
 * @param elementReducer
 * A reducer for a single object that supports the actionNames.create and actionNames.update action.
 * @param initialState (optional)
 * @param idProperty
 * The name of the property to fetch the id from the action. Default: 'id'
 * @returns {crudReducer}
 */
export function genCrudReducer(actionNames, elementReducer, idProperty = 'id') {
    console.assert(actionNames.length === 2, "ActionNames must contain 2 names for create, delete in that order");
    const [CREATE_ACTION, DELETE_ACTION] = actionNames;
    console.assert(_.includes(CREATE_ACTION, "ADD") || _.includes(CREATE_ACTION, "CREATE"),
        "The create action name should probably contain ADD or DELETE, but is: " + CREATE_ACTION);
    console.assert(_.includes(DELETE_ACTION, "DELETE") || _.includes(DELETE_ACTION, "REMOVE"),
        "The delete action name should probably contain DELETE or REMOVE, but is: " + DELETE_ACTION);

    return function crudReducer(state, action) {
        const id = action[idProperty];
        switch (action.type) {
            case CREATE_ACTION: // Create or replace when already exists
                return Object.assign({}, state, {[id]: elementReducer(undefined, action)});
            case DELETE_ACTION:
                const newState = Object.assign({}, state);
                delete newState[id];
                return newState;
            default: // Update if we have an id property
                if (id === undefined) return state;
                const elementState = state[id];
                if (elementState == undefined) {
                    // Do not update what we don't have.
                    // TODO: Log warning, or document why not.
                    return state;
                }
                const updatedElement = elementReducer(elementState, action);
                if (updatedElement == undefined) {
                    console.error("ElementReducer has some problem: ", elementReducer, " with action: ", action);
                    throw new Error("Reducer must return the original state if they not implement the action. Check action " + action.type + ".");
                }

                return Object.assign({}, state, {
                    [id]: updatedElement
                });
        }
    }
}