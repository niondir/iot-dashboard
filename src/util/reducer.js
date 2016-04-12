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
export function genCrudReducer(actionNames:Array<String>, elementReducer:Function, initialState = {}, idProperty = 'id') {
    console.assert(actionNames.length === 3, "ActionNames must contain 3 names for create, update, delete in that order");
    let [CREATE_ACTION, UPDATE_ACTION, DELETE_ACTION] = actionNames;
    console.assert(CREATE_ACTION.includes("ADD") || CREATE_ACTION.includes("CREATE"),
        "The create action name should probably contain ADD or DELETE, but is: " + CREATE_ACTION);
    console.assert(UPDATE_ACTION.includes("UPDATE"),
        "The update action name should probably contain UPDATE, but is: " + UPDATE_ACTION);
    console.assert(DELETE_ACTION.includes("DELETE") || DELETE_ACTION.includes("REMOVE"),
        "The delete action name should probably contain DELETE or REMOVE, but is: " + DELETE_ACTION);

    return function crudReducer(state = initialState, action) {
        let id = action[idProperty];
        switch (action.type) {
            case CREATE_ACTION:
                return {...state, [id]: elementReducer(undefined, action)};
            case DELETE_ACTION:
                var newState = {...state};
                delete newState[id];
                return newState;
            case UPDATE_ACTION:
                const elementState = state[id];
                console.assert(elementState, "Can not find element with id: " + id);
                return {
                    ...state,
                    [id]: elementReducer(elementState, action)
                };
            default:
                return state;
        }
    }
}