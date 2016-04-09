import * as React from 'react'
import $ from 'jquery'
import * as Widgets from './widgets'

export const WidgetConfigDialogs = () => {
    let i = 0;
    const configDialogs = Widgets.getWidgets().map((widget) => {
        return widget.configDialog ? React.createElement(widget.configDialog, {key: i++}) : null;
    });
    return <div>{configDialogs}</div>
};

export function createWidget(type, initialProps = {}) {
    const widget = Widgets.getWidget(type);
    return (dispatch, getState) => {
        if (!widget.configDialog) {
            dispatch(Widgets.addWidget(type, initialProps));
            return;
        }
        Modal.showModal(type);
    }
}


export class Modal extends React.Component {

    componentDidMount() {
        $(`.ui.modal.widget-config`)
            .modal({
                detachable: false,
                closable: false,
                onApprove: ($element) => false,
                onDeny: ($element) => false
            })
    }

    static showModal(widgetType:String) {
        $(`.ui.modal.widget-config.${widgetType}-widget`)
            .modal('show');
    }

    static closeModal(widgetType:String) {
        $(`.ui.modal.widget-config.${widgetType}-widget`).modal('hide');
    }

    handlePositive() {
        if (this.props.positive() !== false) {
            Modal.closeModal(this.props.widgetType);
        }
    }

    handleDeny() {
        if (this.props.deny() !== false) {
            Modal.closeModal(this.props.widgetType);
        }
    }

    render() {
        return <div className={"ui modal widget-config " + this.props.widgetType + "-widget"}>

            <div className="header">
                {this.props.title}
            </div>
            {this.props.children}
            <div className="actions">
                <div className="ui black cancel button" onClick={this.handleDeny.bind(this)}>
                    Cancel
                </div>
                <div className="ui right labeled icon positive button"
                     onClick={this.handlePositive.bind(this)}>
                    Save
                    <i className="checkmark icon"></i>
                </div>
            </div>
        </div>
    }
}






