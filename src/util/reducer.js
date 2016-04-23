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
export function genCrudReducer(actionNames:Array<String>, elementReducer:Function, idProperty = 'id') {
    console.assert(actionNames.length === 2, "ActionNames must contain 2 names for create, delete in that order");
    let [CREATE_ACTION, DELETE_ACTION] = actionNames;
    console.assert(CREATE_ACTION.includes("ADD") || CREATE_ACTION.includes("CREATE"),
        "The create action name should probably contain ADD or DELETE, but is: " + CREATE_ACTION);
    console.assert(DELETE_ACTION.includes("DELETE") || DELETE_ACTION.includes("REMOVE"),
        "The delete action name should probably contain DELETE or REMOVE, but is: " + DELETE_ACTION);

    return function crudReducer(state, action) {
        let id = action[idProperty];
        switch (action.type) {
            case CREATE_ACTION:
                return {...state, [id]: elementReducer(undefined, action)};
            case DELETE_ACTION:
                let  {[id]: deleted, ...newState} = state;
                return newState;
            default: // Update if we have an id property
                if(id === undefined) return state;
                const elementState = state[id];
                if (elementState == undefined) {
                    // Do not update what we don't have.
                    return state;
                }
                const updatedElement = elementReducer(elementState, action);
                if (updatedElement == undefined) {
                    console.error("ElementReducer has some problem: ", elementReducer, " with action: ", action);
                    throw new Error("Reducer must return the original state if they not implement the action. Check action " + action.type + ".");
                }

                return {
                    ...state,
                    [id]: updatedElement
                };
        }
    }
}