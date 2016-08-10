/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


import {IDatasourcePlugin} from "./datasourcePluginFactory";
import {DashboardStore} from "../store";
import {DatasourceScheduler} from "./datasourceScheduler";

/**
 * Represents a plugin instance, state should be saved in store!
 */
export class DatasourcePluginInstance {
    private scheduler: DatasourceScheduler;

    constructor(public id: string, private dsInstance: IDatasourcePlugin, private store: DashboardStore) {
        this.scheduler = new DatasourceScheduler(this, this.store);
        this.scheduler.start();
    }

    get props() {
        return this.dsInstance.props;
    }

    set props(newProps: any) {
        const oldProps = this.dsInstance.props;
        if (oldProps !== newProps) {
            this.datasourceWillReceiveProps(newProps);
            this.dsInstance.props = newProps;
        }
    }

    get state() {
        return this.store.getState().datasources[this.id];
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
