import React from 'react';
import {connect} from 'react-redux'
import * as Modal from './modalDialog'
import * as ui from '../ui/elements.ui.js'
import {PropTypes as Prop}  from "react";


class ModalDialog extends React.Component {

    componentDidMount() {
        $('.ui.modal.' + this.props.id)
            .modal({
                detachable: false,
                closable: false,
                observeChanges: true,
                onApprove: ($element) => false,
                onDeny: ($element) => false
            })
    }

    onClick(e, action) {
        if (action.onClick(e)) {
            // Closing is done externally (by redux)
            this.props.closeDialog();
            //ModalDialog.closeModal(this.props.id);
        }
    }


    render() {
        let key = 0;
        const actions = this.props.actions.map(action => {
            return <div key={key++} className={action.className} onClick={(e) => this.onClick(e, action)}>
                {action.label}
                {action.iconClass ? <i className={action.iconClass}/> : null}
            </div>
        });

        const props = this.props;
        return <div id={this.props.id} className={'ui modal ' + this.props.id}>
            <div className="header">
                {props.title}
            </div>
            <div className="content">
                {props.children}
            </div>
            <div className="actions">
                {actions}
            </div>
        </div>
    }
}

ModalDialog.propTypes = {
    children: React.PropTypes.element.isRequired,
    title: Prop.string.isRequired,
    id: Prop.string.isRequired,
    actions: Prop.arrayOf(
        Prop.shape({
            className: Prop.string.isRequired,
            iconClass: Prop.string,
            label: Prop.string.isRequired,
            onClick: Prop.func.isRequired
        })
    ).isRequired,
    handlePositive: Prop.func,
    handleDeny: Prop.func,
    closeDialog: Prop.func
};

export default connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            closeDialog: () => dispatch(Modal.closeModal())
        }
    }
)(ModalDialog)