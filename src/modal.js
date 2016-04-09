import * as React from 'react';
import $ from 'jquery'

var showModal = function(){
    $(window).trigger('modal.visible');
}

// This is an element on the page that renders a fullscreen overalay for the modals
var ModalPage = React.createClass({
    getInitialState: function() {
        return {
            visible: false
        };
    },
    componentDidMount: function() {
        var self = this;
        $(window).on('modal.visible', function(ev){
            self.setState({visible: true});
        });
        $(window).on('modal.hidden', function(ev){
            self.setState(self.getInitialState());
        });
    },
    handleClick: function(ev){
        if (ev.target == this.getDOMNode()){
            $(window).trigger('modal.hidden');
        }
    },
    render: function() {
        var modal_classes = (this.state.visible)? 'ui dimmer modals page transition visible active' : 'ui dimmer modals page transition hidden';
        return (
            <div className={modal_classes} onClick={this.handleClick}>
                {this.props.children /* this should be of type Modal Dialog */}
            </div>
        );
    }
});


var ModalDialog = React.createClass({
    getInitialState: function() {
        return {
            visible: false
        };
    },
    componentDidMount: function() {
        var self = this;
        $(window).on('modal.visible', function(ev){
            self.setState({visible: true});
        });
        $(window).on('modal.hidden', function(ev){
            self.setState(self.getInitialState());
        });
    },
    render: function() {
        var modal_classes = (this.state.visible)? 'ui small modal transition visible active' : 'ui small modal transition hidden';
        return (
            <div className={modal_classes}>
                <div className="ui center aligned header">Hello</div>
                <div className="content">
                    <p>World</p>
                </div>
            </div>
        );
    }
});