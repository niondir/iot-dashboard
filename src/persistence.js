

let lastSave = new Date();

export function clearData() {
    lastSave = new Date();
    if (window.confirm("Wipe app data and reload page?")) {
        window.localStorage.setItem("appState", undefined);
        location.reload();
    }
}

export function persistenceMiddleware({getState}) {
    return (next) => (action) => {

        const nextState = next(action);

        let now = new Date();
        if (now.getTime() - lastSave.getTime() < 10000) {
            return nextState;
        }

        saveToLocalStorage(getState());
        console.log('Saved state ...');
        lastSave = new Date();
        return nextState;
    }
}

export function saveToLocalStorage(state) {
    const {form, modalDialog ,...savableState} = state;
    window.localStorage.setItem("appState", JSON.stringify(savableState));
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