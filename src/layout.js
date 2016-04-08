import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'
import {Provider} from 'react-redux'
import {CounterApp} from './exampleCounter'
import * as WidgetGrid from './widgetGrid'
import * as Nav from './navigation'
import $ from 'jquery'

export default class Layout extends Component {

    componentDidMount() {
        $('.main.menu .add-widget')
            .popup({
                popup: '.widgets-menu.popup',
                hoverable: true,
                preserve: true,
                position: 'bottom left',
                delay: {
                    show: 300,
                    hide: 800
                }
            });
    }


    render() {
        return <div className="container">
            <div className="ui flowing basic widgets-menu popup">
                <div className="ui one column relaxed divided grid">
                    <div className="column">
                        <h4 className="ui header">Simple</h4>
                        <div className="ui link list">
                            <Nav.AddWidget title="Text" icon="plus" type="text"/>
                            <Nav.AddWidget title="Clock" icon="plus" type="time"/>
                        </div>
                    </div>
                </div>
            </div>


            <div className="ui fixed inverted main menu">
                <div className="ui container">
                    <a href="#" className="header item">
                        {/*<img className="logo" src="assets/images/logo.png"/>*/}
                        Dashboard
                    </a>
                    <a className="add-widget item">New Widget <i className="dropdown icon"></i></a>

                    <div className="ui simple dropdown item">
                        Widgets <i className="dropdown icon"></i>
                        <div className="menu">
                            <Nav.AddWidget title="Add Widget" type="text"/>
                        </div>
                    </div>
                </div>
            </div>


            <div className="ui grid">

                <WidgetGrid.WidgetGrid widgets={[1,2,3,4]}/>

            </div>
            {/*<CounterApp/>*/}
        </div>
    }

}