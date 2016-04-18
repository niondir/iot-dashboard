import * as React from 'react';
import {Component} from 'react';
import * as WidgetGrid from './widgetGrid'
import * as Nav from './navigation'
import $ from 'jquery'
import {WidgetConfigDialog} from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts.ui'
import * as Import from './dashboard/import.ui'
import * as Datasources from './datasource/datasource.ui'

export default class Layout extends Component {


    componentDidMount() {
        $('.main.menu .add-widget')
            .popup({
                popup: '.widgets-menu.popup',
                movePopup: false,
                hoverable: true, // Do not close while mouse over
                preserve: true, // Stay in DOM after close
                position: 'bottom left',
                delay: {
                    show: 0,
                    hide: 50
                }
            });
    }


    render() {
        return <div className="container">

            <WidgetConfigDialog/>
            <Import.Modal/>
            <Datasources.Modal/>

            <div className="ui flowing basic widgets-menu menu popup">
                <div className="ui sixteen column relaxed divided grid">
                    <div className="column">
                        <div className="ui link list">
                            <h4 className="ui header">Simple</h4>
                            {/* TODO: render nav items based on the widget registry */}
                            <Nav.AddWidget text="Text" type="text"/>
                            <Nav.AddWidget text="Clock" type="time"/>
                            <Nav.AddWidget text="Chart" type="chart"/>
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

                    <Import.TopNavItem/>
                    <Layouts.TopNavItem/>
                    <Datasources.TopNavItem/>
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