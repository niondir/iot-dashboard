import React from "react";
import _ from "lodash";
import * as ui from "../ui/elements.ui";
import {connect} from 'react-redux'
import {reset} from "redux-form";
import * as ModalIds from '../modal/modalDialogIds'
import * as Modal from '../modal/modalDialog'
const Prop = React.PropTypes;


const TopNavItem = (props) => {
    return <a className="item" onClick={() => props.showPluginsDialog()}>
        Plugins
    </a>
};


export default connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            showPluginsDialog: () => {
                dispatch(Modal.showModal(ModalIds.PLUGINS))
            }
        }
    }
)(TopNavItem);