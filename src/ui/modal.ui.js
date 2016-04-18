import React from 'react';
import {connect} from 'react-redux'
import {valuesOf} from '../util/collection'
import * as ui from '../ui/elements.ui'
const Prop = React.PropTypes;


export default class ModalDialog extends React.Component {

    componentDidMount() {
        console.log("Mounted Modal: " + this.props.id);
        $('.ui.modal.' + this.props.id)
            .modal({
                detachable: false,
                closable: false,
                observeChanges: true,
                onApprove: ($element) => false,
                onDeny: ($element) => false
            })
    }

    static showModal(id) {
        console.log("Show Modal: " + id);
        $('.ui.modal.' + id)
            .modal('show');
    }

    static closeModal(id) {
        console.log("Close Modal: " + id);
        $('.ui.modal.' + id).modal('hide');
    }


    setWidgetProps(props) {
        this.widgetProps = props;
    }

    onClick(e, action) {
        if (action.onClick(e)) {
            ModalDialog.closeModal(this.props.id);
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
        console.log("Render Modal: " + this.props.id);
        return <div className={'ui modal ' + this.props.id}>
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
    handleDeny: Prop.func
};