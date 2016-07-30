/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import {DashboardStore} from "../store";
import {IPluginFactory, IPlugin} from "../pluginApi/pluginRegistry";
import {IDatasourceState} from "./datasource";
import Unsubscribe = Redux.Unsubscribe;


export interface IDatasourceConstructor extends IDatasourcePlugin {
    new(props: any): IDatasourcePlugin
}

export interface IDatasourcePlugin extends IPlugin {
    props?: any
    datasourceWillReceiveProps?: (newProps: any) => void
    dispose?: () => void
    getValues?(): any[] // TODO: Might get depricated
    fetchData?<T>(resolve: (value?: T | Thenable<T>) => void, reject: (reason?: any) => void): void
}


/**
 * Connects a datasource to the application state
 */
export default class DataSourcePluginFactory implements IPluginFactory<IDatasourcePlugin> {

    private _plugins: {[id: string]: IDatasourcePlugin} = {};
    private _unsubscribe: Unsubscribe;
    private _disposed: boolean = false;

    constructor(private _type: string, private _datasource: IDatasourcePlugin, private _store: DashboardStore) {
        this._unsubscribe = _store.subscribe(this.handleStateChange.bind(this));
    }

    get type() {
        return this._type;
    }

    get disposed() {
        return this._disposed;
    }

    getDatasourceState(id: string) {
        const state = this._store.getState();
        const dsState = state.datasources[id];

        if (!dsState) {
            throw new Error("Can not get state of non existing datasource with id " + id);
        }
        return dsState;
    }

    /**
     * Better use getInstance or createInstance directly!
     */
    getOrCreateInstance(id: string) {
        if (!this._plugins[id]) {
            return this.createInstance(id)
        }
        return this.getInstance(id);
    }

    createInstance(id: string): IDatasourcePlugin {
        if (this._disposed === true) {
            throw new Error("Try to create datasource of destroyed type: " + JSON.stringify({id, type: this.type}));
        }
        if (this._plugins[id] !== undefined) {
            throw new Error("Can not create datasource instance. It already exists: " + JSON.stringify({
                    id,
                    type: this.type
                }));
        }

        const dsState = this.getDatasourceState(id);
        const props = {
            state: dsState
        };
        const pluginInstance = new (<IDatasourceConstructor>this._datasource)(props);

        pluginInstance.props = props;

        // Bind API functions to instance
        if (_.isFunction(pluginInstance.datasourceWillReceiveProps)) {
            pluginInstance.datasourceWillReceiveProps = pluginInstance.datasourceWillReceiveProps.bind(pluginInstance);
        }
        if (_.isFunction(pluginInstance.dispose)) {
            pluginInstance.dispose = pluginInstance.dispose.bind(pluginInstance);
        }
        if (_.isFunction(pluginInstance.getValues)) {
            pluginInstance.getValues = pluginInstance.getValues.bind(pluginInstance);
        }
        // TODO: bind (and require?) fetchData()

        this._plugins[id] = pluginInstance;
        return pluginInstance;
    }

    getInstance(id: string) {
        if (this._disposed === true) {
            throw new Error("Try to get datasource of destroyed type. " + JSON.stringify({id, type: this.type}));
        }
        if (!this._plugins[id]) {
            throw new Error("No running instance of datasource. " + JSON.stringify({id, type: this.type}));
        }
        return this._plugins[id];
    }

    dispose() {
        this._disposed = true;
        _.valuesIn<IDatasourcePlugin>(this._plugins).forEach((plugin) => {
            if (_.isFunction(plugin.dispose)) {
                try {
                    plugin.dispose();
                }
                catch (e) {
                    console.error("Failed to destroy Datasource instance", plugin);
                }
            }
        });
        this._plugins = {};
        this._unsubscribe();
    }

    handleStateChange() {
        const state = this._store.getState();
        _.valuesIn<IDatasourceState>(state.datasources).forEach(dsState => this.updateDatasource(dsState))
    }

    updateDatasource(dsState: IDatasourceState) {
        const plugin = this._plugins[dsState.id];
        if (!plugin) {
            // This is normal to happen when the app starts,
            // since the state already contains the id's before plugin instances are loaded
            //console.warn("Can not find Datasource instance with id " + dsState.id + ". Skipping Update!");
            return;
        }

        const oldProps = plugin.props;
        const newProps = _.assign({oldProps, state: dsState});
        if (oldProps !== newProps) {
            if (_.isFunction(plugin.datasourceWillReceiveProps)) {
                plugin.datasourceWillReceiveProps(newProps);
            }
            plugin.props = newProps;
        }
    }
}