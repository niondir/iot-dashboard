/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as _ from "lodash";
import {DashboardStore} from "../store";
import {IPluginFactory, IPlugin} from "../pluginApi/pluginRegistry";
import * as Datasource from "./datasource";
import {IDatasourceState} from "./datasource";
import {DatasourcePluginInstance} from "./datasourcePluginInstance";
import Unsubscribe = Redux.Unsubscribe;


export interface IDatasourceConstructor extends IDatasourcePlugin {
    new(props: any): IDatasourcePlugin
}

export interface DatasourceProps {
    state: IDatasourceState
    setFetchInterval: (intervalInMs: number) => void
}

export interface IDatasourcePlugin extends IPlugin {
    props?: DatasourceProps
    datasourceWillReceiveProps?: (newProps: any) => void
    dispose?: () => void
    fetchData?<T>(resolve: (value?: T | Thenable<T>) => void, reject: (reason?: any) => void): void
}


/**
 * Connects a datasource to the application state
 */
export default class DataSourcePluginFactory implements IPluginFactory<DatasourcePluginInstance> {

    private _pluginInstances: {[id: string]: DatasourcePluginInstance} = {};
    private _unsubscribe: Unsubscribe;
    private _disposed: boolean = false;

    constructor(private _type: string, private _datasource: IDatasourcePlugin, private _store: DashboardStore) {
        this._unsubscribe = _store.subscribe(() => this.handleStateChange());
    }

    get type() {
        return this._type;
    }

    get disposed() {
        return this._disposed;
    }

    getInstance(id: string) {
        if (this._disposed === true) {
            throw new Error("Try to get datasource of destroyed type. " + JSON.stringify({id, type: this.type}));
        }
        if (!this._pluginInstances[id]) {
            throw new Error("No running instance of datasource. " + JSON.stringify({id, type: this.type}));
        }
        return this._pluginInstances[id];
    }

    dispose() {
        this._disposed = true;
        _.valuesIn<IDatasourcePlugin>(this._pluginInstances).forEach((plugin) => {
            if (_.isFunction(plugin.dispose)) {
                try {
                    plugin.dispose();
                }
                catch (e) {
                    console.error("Failed to destroy Datasource instance", plugin);
                }
            }
        });
        this._pluginInstances = {};
        this._unsubscribe();
    }

    handleStateChange() {
        const state = this._store.getState();

        // Create Datasource instances for missing data sources in store
        _.valuesIn<IDatasourceState>(state.datasources)
            .filter((dsState) => dsState.type === this.type)
            .forEach((dsState) => {
                if (this._pluginInstances[dsState.id] === undefined) {
                    this._pluginInstances[dsState.id] = this.createInstance(dsState.id);
                    this._store.dispatch(Datasource.finishedLoading(dsState.id))
                }
            });

        // For all running datasources we notify them about setting changes
        _.valuesIn<IDatasourceState>(state.datasources).forEach(dsState => this.updateDatasource(dsState))
    }

    private updateDatasource(dsState: IDatasourceState) {
        const plugin = this._pluginInstances[dsState.id];
        if (!plugin) {
            // This is normal to happen when the app starts,
            // since the state already contains the id's before plugin instances are loaded
            //console.warn("Can not find Datasource instance with id " + dsState.id + ". Skipping Update!");
            return;
        }

        plugin.props = _.assign({}, plugin.props, {state: dsState});
    }

    private createInstance(id: string): DatasourcePluginInstance {
        if (this._disposed === true) {
            throw new Error("Try to create datasource of destroyed type: " + JSON.stringify({id, type: this.type}));
        }
        if (this._pluginInstances[id] !== undefined) {
            throw new Error("Can not create datasource instance. It already exists: " + JSON.stringify({
                    id,
                    type: this.type
                }));
        }


        return new DatasourcePluginInstance(id, <IDatasourceConstructor>this._datasource, this._store);
    }
}
