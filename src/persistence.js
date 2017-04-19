/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let lastAction = "NONE";
let allowSave = true;
let saveTimeout;

export function clearData() {
    if (window.confirm("Wipe app data and reload page?")) {
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        window.localStorage.setItem("appState", undefined);
        location.reload();
    }
}

export function persistenceMiddleware({getState}) {
    return (next) => (action) => {

        const nextState = next(action);

        if (!allowSave) {
            lastAction = action;
            return nextState;
        }


        if (!action.doNotPersist) {
            // we wait some before we save
            // this leads to less saving (max every 100ms) without loosing actions
            // if we would just block saving for some time after saving an action we would loose the last actions
            allowSave = false;
            saveTimeout = setTimeout(() => {
                saveToLocalStorage(getState());
                console.log('Saved state @' + lastAction.type);

                allowSave = true;
            }, 100)


        }
        lastAction = action;
        return nextState;
    }
}

export function saveToLocalStorage(state) {
    if (typeof window === 'undefined') {
        console.warn("Can not save to local storage in current environment.");
        return;
    }

    const savableState = Object.assign({}, state);

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