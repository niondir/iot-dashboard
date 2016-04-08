import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'
import {Modal} from './widgetConfig'
import $ from 'jquery'

export const TYPE = "text";

export class Widget extends Component {

    render() {
        return <p>{this.props.text}</p>
    }
}

// TODO: We should get it generic and only base it on the Widget state
export class ConfigDialog extends React.Component {


    static showModal() {
        $(`.ui.modal.config-widget-${TYPE}`)
            .modal('setting', 'closable', false)
            .modal('setting', 'onApprove', ($element) => true)
            .modal('setting', 'onDeny', ($element) => true)
            .modal('show');
    };

    static closeModal() {
        $(`.ui.modal.config-widget-${TYPE}`)
            .modal('close');
    };


    render() {
        return <Modal className={`config-widget-${TYPE}`} title="Configure Text Widget">
            <div className="content">
                <form className="ui form">
                    <div className="field">
                        <label>Text</label>
                        <input type="text" name="first-name" placeholder="Content of the widget"/>
                    </div>
                </form>
            </div>
        </Modal>
    }
}