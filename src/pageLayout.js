import * as React from "react"
import {Component} from "react"
import * as ReactDOM from "react-dom"
import {PropTypes as Prop}  from "react"
import {connect} from 'react-redux'
import * as Dashboard from './dashboard/dashboard'
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

export class Layout extends Component {

    onFullscreenKeyPress(e) {
        console.log("key pressed", event.keyCode);
        var intKey = (window.Event) ? e.which : e.keyCode;
        if (intKey === 27 && this.props.isFullscreen) {
            this.props.setFullscreen(false);
        }
    }

    componentDidMount() {
        this.onFullscreenKeyPress = this.onFullscreenKeyPress.bind(this);
        
        ReactDOM.findDOMNode(this)
            .offsetParent
            .addEventListener('keydown', this.onFullscreenKeyPress);
    }

    render() {
        const props = this.props;

        if (props.isFullscreen) {
            return <div onKeyUp={(event) => this.onFullscreenKeyPress(event)}>
                <div className="fullscreen-button">
                    <button class="ui large button" onClick={() => props.setFullscreen(false)}><i className="compress icon"></i></button>
                </div>
                <div className="container">
                    <div className="ui grid">
                        <WidgetGrid/>
                    </div>
                </div>
            </div>
        }

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
                        <a className="item" onClick={() => props.setFullscreen(!props.isFullscreen)}>
                            <i className="angle double up icon"/> {/*expand*/}
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

Layout.propTypes = {
    setFullscreen: Prop.func.isRequired,
    isFullscreen: Prop.bool.isRequired
};

export default connect(
    state => {
        return {
            isFullscreen: state.dashboard.isFullscreen
        };
    },
    dispatch => {
        return {
            setFullscreen: (isFullscreen) => dispatch(Dashboard.setFullscreen(isFullscreen))
        };
    }
)(Layout);