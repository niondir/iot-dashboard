import * as Redux from 'redux'
import {IDispatch} from "~react-redux~redux/redux";

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
    if (typeof window === 'undefined') {
        console.warn("Can not save to local storage in current environment.");
        return;
    }

    var savableState = Object.assign({}, state);

    delete savableState.form;
    delete savableState.modalDialog;
    window.localStorage.setItem("appState", JSON.stringify(savableState));
}


export function loadFromLocalStorage() {
    if (typeof window === 'undefined') {
        console.warn("Can not load from local storage in current environment.");
        return undefined;
    }

    const stateString = window.localStorage.getItem("appState");
    let state = undefined;
    try {
        if (stateString !== undefined && stateString !== "undefined") {
            state = JSON.parse(stateString);
        }
    }
    catch (e) {
        console.error("Failed to load state from local storage. Data:", stateString, e.message);
    }
    console.log("Loaded state:", state);
    return state !== null ? state : undefined;
}