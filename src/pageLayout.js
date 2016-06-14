import * as React from "react"
import {Component} from "react"
import WidgetGrid from "./widgets/widgetGrid.ui"
import $ from "jquery"
import LayoutsNavItem from "./layouts/layouts.ui"
import WidgetConfigDialog from "./widgets/widgetConfigDialog.ui"
import DashboardMenuEntry from "./dashboard/dashboardMenuEntry.ui"
import ImportExportDialog from "./dashboard/importExportDialog.ui"
import DatasourceConfigDialog from "./datasource/datasourceConfigDialog.ui"
import DatasourceNavItem from "./datasource/datasourceNavItem.ui"
import WidgetsNavItem from "./widgets/widgetsNavItem.ui"
import PluginNavItem from './pluginApi/pluginNavItem.ui'
import PluginsDialog from './pluginApi/pluginsDialog.ui'
import * as Persistence from './persistence'

export default class Layout extends Component {
    render() {
        return <div>
            <div>
                <WidgetConfigDialog/>
                <ImportExportDialog/>
                <DatasourceConfigDialog/>
                <PluginsDialog/>
            </div>
            <div className="container">
                <div className="ui fixed inverted main menu">
                    <div className="ui container">
                        <a href="#" className="header item">
                            {/*<img className="logo" src="assets/images/logo.png"/>*/}
                            Dashboard
                        </a>

                        <DashboardMenuEntry/>
                        <WidgetsNavItem/>
                        <DatasourceNavItem/>
                        <PluginNavItem/>
                        <LayoutsNavItem/>
                        <a className="item" onClick={() => Persistence.clearData()}>
                            <i className="red bomb icon"/>
                            Reset Everything!
                        </a>

                    </div>
                </div>

                {/* TODO: Use custom classes for everything inside the Grid to make it customizable without breaking semantic-ui */}
                <div className="ui grid">
                    <WidgetGrid/>
                </div>
            </div>
        </div>
    }

}