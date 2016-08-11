/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


import {IDatasourcePlugin, IDatasourceConstructor} from "./datasourcePluginFactory";
import {DashboardStore} from "../store";
import {DatasourceScheduler} from "./datasourceScheduler";
import {updatedMaxValues} from "./datasource";

/**
 * Represents a plugin instance, state should be saved in store!
 */
export class DatasourcePluginInstance {
    private scheduler: DatasourceScheduler;
    private dsInstance: IDatasourcePlugin;

    constructor(public id: string, private dsConstructor: IDatasourceConstructor, private store: DashboardStore) {
        this.scheduler = new DatasourceScheduler(this, this.store);

        const dsState = this.state;
        const props = {
            state: dsState,
            setFetchInterval: (ms: number) => this.setFetchInterval(ms)
        };

        console.log("dsConstructor", dsConstructor)
        const pluginInstance = new dsConstructor(props);
        this.dsInstance = pluginInstance;

        pluginInstance.props = props;

        // Bind API functions to instance
        if (_.isFunction(pluginInstance.datasourceWillReceiveProps)) {
            pluginInstance.datasourceWillReceiveProps = pluginInstance.datasourceWillReceiveProps.bind(pluginInstance);
        }
        if (_.isFunction(pluginInstance.dispose)) {
            pluginInstance.dispose = pluginInstance.dispose.bind(pluginInstance);
        }
        if (_.isFunction(pluginInstance.fetchData)) {
            pluginInstance.fetchData = pluginInstance.fetchData.bind(pluginInstance);
        }

        this.scheduler.start();
    }

    get props() {
        return this.dsInstance.props;
    }

    setFetchInterval(intervalMs: number) {
        this.scheduler.fetchInterval = intervalMs;
    }

    /**
     * The the number of values stored in the datasource
     * @param maxValues
     */
    setMaxValues(maxValues: number) {
        this.store.dispatch(updatedMaxValues(this.id, maxValues));
    }

    set props(newProps: any) {
        const oldProps = this.dsInstance.props;
        if (oldProps !== newProps) {
            this.datasourceWillReceiveProps(newProps);
            this.dsInstance.props = newProps;
        }
    }

    get state() {
        const state = this.store.getState();
        const dsState = state.datasources[this.id];

        if (!dsState) {
            throw new Error("Can not get state of non existing datasource with id " + this.id);
        }

        return dsState;
    }

    get pluginState() {
        return this.store.getState().datasourcePlugins[this.state.type];
    }

    datasourceWillReceiveProps(newProps: any) {
        if (_.isFunction(this.dsInstance.datasourceWillReceiveProps)) {
            this.dsInstance.datasourceWillReceiveProps(newProps);
        }
    }

    fetchData(resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void) {
        if (!this.dsInstance.fetchData) {
            console.warn("fetchData(resolve, reject) is not implemented in Datasource ", this.dsInstance);
            reject(new Error("fetchData(resolve, reject) is not implemented in Datasource " + this.pluginState.id))
        }
        this.dsInstance.fetchData(resolve, reject);

    }

    dispose() {
        this.scheduler.dispose();
    }
}
