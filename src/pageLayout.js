import * as React from "react"
import {Component} from "react"
import WidgetGrid from "./widgets/widgetGrid.ui"
import * as Nav from "./navigation"
import $ from "jquery"
import * as Layouts from "./layouts/layouts.ui"
import WidgetConfigDialog from "./widgets/widgetConfigDialog.ui"
import * as Import from "./dashboard/import.ui"
import DatasourceConfigDialog from "./datasource/datasourceConfigDialog.ui"
import DatasourceNavItem from "./datasource/datasourceNavItem.ui"
import * as Persistence from './persistence'

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
            <DatasourceConfigDialog/>

            <div className="ui flowing basic widgets-menu menu popup">
                <div className="ui sixteen column relaxed divided grid">
                    <div className="column">
                        <div className="ui link list">
                            <h4 className="ui header">Simple</h4>
                            {/* TODO: render nav items based on the widget registry */}
                            <Nav.AddWidget text="Text" type="text"/>
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
                    <a className="add-widget item">New Widget <i className="dropdown icon"></i></a>
                    <Layouts.TopNavItem/>
                    <DatasourceNavItem/>
                    <a className="item" onClick={() => Persistence.clearData()}>
                        <i className="red bomb icon"/>
                        Wipe Everything!
                    </a>

                </div>
            </div>

            <div className="ui grid">
                <WidgetGrid/>
            </div>
            {/*<CounterApp/>*/}
        </div>
    }

}