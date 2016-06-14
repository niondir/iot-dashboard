import * as Action from '../actionNames'
import ModalDialog from './modalDialog.ui.js'

const initialState = {
    dialogId: null,
    isVisible: false,
    data: {}
};

function showModalSideeffect(id) {
    const $modal = $('.ui.modal.' + id);
    
    if (!$modal.length) {
       throw new Error("Can not find Modal with id", id, $modal); 
    }

    $modal.modal('show');

    // This is to update the Browser Scrollbar, at least needed in WebKit
    if (typeof document !== 'undefined') {
        const n = document.createTextNode(' ');
        $modal.append(n);
        setTimeout(function () {
            n.parentNode.removeChild(n)
        }, 0);
    }
}

function closeModalSideeffect(id) {
    $('.ui.modal.' + id).modal('hide');
}

function updateModalVisibility(stateAfter, stateBefore) {
    const dialogBefore = stateBefore.modalDialog;
    const dialogAfter = stateAfter.modalDialog;

    if (dialogBefore.isVisible !== dialogAfter.isVisible) {
        if (stateAfter.modalDialog.isVisible) {
            showModalSideeffect(dialogAfter.dialogId);
        }
        else {
            closeModalSideeffect(dialogBefore.dialogId);
        }
    }
    else if (dialogBefore.dialogId && dialogAfter.dialogId && dialogBefore.dialogId !== dialogAfter.dialogId) {
        closeModalSideeffect(dialogBefore.dialogId);
        showModalSideeffect(dialogAfter.dialogId);
    }
}


export function showModal(id, data = {}) {
    return (dispatch, getState) => {
        const stateBefore = getState();
        dispatch({
            type: Action.SHOW_MODAL,
            dialogId: id,
            data
        });

        const stateAfter = getState();
        updateModalVisibility(stateAfter, stateBefore);
    }
}

export function closeModal() {
    return (dispatch, getState) => {
        const stateBefore = getState();
        dispatch({
            type: Action.HIDE_MODAL
        });

        const stateAfter = getState();
        updateModalVisibility(stateAfter, stateBefore);
    }
}

export function modalDialog(state = initialState, action) {
    switch (action.type) {
        case Action.SHOW_MODAL:
            return {
                ...state,
                dialogId: action.dialogId,
                data: action.data,
                isVisible: true
            };
        case Action.HIDE_MODAL:
            return {
                ...state,
                dialogId: null,
                data: null,
                isVisible: false
            };
        default:
            return state;
    }
}