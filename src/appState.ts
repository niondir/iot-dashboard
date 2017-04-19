/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Redux from 'redux'
import * as Datasource from './datasource/datasource'
import * as Widgets from './widgets/widgets'
import * as DatasourcePlugins from './datasource/datasourcePlugins'
import * as Config from './config'
import * as Plugins from './pluginApi/plugins'

export type Dispatch = Redux.Dispatch<State>
export type GetState = () => State
export type ThunkAction = Redux.ThunkAction<any, State, any>
export interface Action extends Redux.Action {
    doNotLog?: boolean
}
export type AnyAction = ThunkAction | Action
export type Reducer = Redux.Reducer<State>

export interface State {
    config: Config.IConfigState
    widgets: Widgets.IWidgetsState
    datasources: Datasource.IDatasourcesState
    datasourcePlugins: DatasourcePlugins.IDatasourcePluginsState
    widgetPlugins: any // TODO: type WidgetPlugins (and migrate to ts)
    pluginLoader: Plugins.IPluginLoaderState
    global: IGlobalState
}

// TODO: move to dashboard/global when converted to ts
export interface IGlobalState {
    isReadOnly: boolean
    devMode: boolean
}

export interface ITypeInfo {
    type: string // The name of the type - must be unique
    name?: string // The user friendly name of the Plugin
    description?: string // A user friendly description that explains the Plugin
    dependencies?: string[] // A list of URL's to load external scripts from. Some scripts like jQuery will be available by default in future
    settings?: ISetting[] // A list of settings that can be changed by the user when the Plugin is initialized
}

export interface ISetting {
    id: string // Technical id, used to receive the value later
    name: string // User friendly string to describe the value
    type: string // Defines how the setting is rendered, validated and interpreted
    description?: string // User friendly description with detail information about the value
    defaultValue?: any // The default value that is preset when a new Plugin is configured, currently must be a string
    required?: boolean // true when the setting is required
}

export default State;