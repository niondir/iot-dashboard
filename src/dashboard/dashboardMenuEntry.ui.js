/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import {connect} from 'react-redux'
import * as Import from './import'
import ModalDialog from '../modal/modalDialog.ui'
import * as Modal from '../modal/modalDialog'
import * as ModalIds from '../modal/modalDialogIds'
import {PropTypes as Prop}  from "react";


const DashboardTopNavItem = (props) => {
    return <div className="ui simple dropdown item">
        Board
        <i className="dropdown icon"/>
        <div className="ui menu">
            <a className="item" onClick={() => props.showModal(ModalIds.DASHBOARD_IMPORT_EXPORT)}>
                <i className="folder open outline icon"/>
                Import / Export
            </a>

        </div>
    </div>
};

DashboardTopNavItem.propTypes = {
    showModal: Prop.func.isRequired
};

export default connect((state) => {
    return {
        state: state
    }
}, (dispatch) => {
    return {
        showModal: (id) => dispatch(Modal.showModal(id))
    }
})(DashboardTopNavItem);

