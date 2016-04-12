import * as React from 'react';
import {Component} from 'react';
import * as WidgetGrid from './widgetGrid'
import * as Nav from './navigation'
import $ from 'jquery'
import {WidgetConfigDialog} from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts.ui'

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

            <WidgetConfigDialog/>

            <div className="ui flowing basic widgets-menu popup">
                <div className="ui one column relaxed divided grid">
                    <div className="column">
                        <h4 className="ui header">Simple</h4>
                        <div className="ui link list">
                            {/* TODO: render nav items based on the widget registry */}
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

                    <Layouts.NavItem layouts={[{name: "My Layout"}]}/>
                    
                    <a className="add-widget item">New Widget <i className="dropdown icon"></i></a>

                </div>
            </div>


            <div className="ui grid">
                <WidgetGrid.WidgetGrid/>
            </div>
            {/*<CounterApp/>*/}
        </div>
    }

}