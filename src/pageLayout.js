import * as React from "react"
import {Component} from "react"
import WidgetGrid from "./widgets/widgetGrid.ui"
import * as Nav from "./navigation"
import $ from "jquery"
import * as Layouts from "./layouts/layouts.ui"
import WidgetConfigDialog from "./widgets/widgetConfigDialog.ui"
import DashboardMenuEntry from "./dashboard/dashboardMenuEntry.ui"
import ImportExportDialog from "./dashboard/importExportDialog.ui.js"
import DatasourceConfigDialog from "./datasource/datasourceConfigDialog.ui"
import DatasourceNavItem from "./datasource/datasourceNavItem.ui"
import PluginNavItem from './pluginApi/pluginNavItem.ui'
import PluginsDialog from './pluginApi/pluginsDialog.ui'
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
        return <div>
            <div>
                <WidgetConfigDialog/>
                <ImportExportDialog/>
                <DatasourceConfigDialog/>
                <PluginsDialog/>
            </div>
            <div className="container">
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

                        <DashboardMenuEntry/>
                        <a className="add-widget item">New Widget <i className="dropdown icon"></i></a>
                        <DatasourceNavItem/>
                        <PluginNavItem/>
                        <Layouts.TopNavItem/>
                        <a className="item" onClick={() => Persistence.clearData()}>
                            <i className="red bomb icon"/>
                            Reset Everything!
                        </a>

                    </div>
                </div>

                <div className="ui grid">
                    <WidgetGrid/>
                </div>
                {/*<CounterApp/>*/}
            </div>
        </div>
    }

}