export function persistenceMiddleware({getState}) {
    return (next) => (action) => {
        const nextState = next(action);
        saveToLocalStorage(getState());
        console.log('Saved state ...');
        return nextState;
    }
}

export function saveToLocalStorage(state) {
    window.localStorage.setItem("appState", JSON.stringify(state));
}


export function loadFromLocalStorage() {
    const stateString = window.localStorage.getItem("appState");
    let state = undefined;
    try {
        state = JSON.parse(stateString);
    }
    catch (e) {
        console.error("Failed to load state from local storage. Data: " + stateString);
    }
    console.log("Loaded state:");
    console.log(state);
    return state !== null ? state : undefined;
}