/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {DashboardStore} from "../store";
import {DatasourcePluginInstance} from "./datasourcePluginInstance";
import * as Datasource from "./datasource";

export class DatasourceScheduler {

    private fetchPromise: Promise<any>;
    private interval: number;
    private disposed = false;


    constructor(private dsInstance: DatasourcePluginInstance, private store: DashboardStore) {
    }

    start() {
        // TODO: make fetch interval configurable per datasource
        this.interval = setInterval(() => {
            this.doFetchData();
        }, 1000)
    }

    dispose() {
        clearInterval(this.interval);
        this.disposed = true;
    }

    private doFetchData() {
        const dsState = this.store.getState().datasources[this.dsInstance.id];

        if (dsState.isLoading) {
            console.log("Skipping fetchData because plugin is still loading");
        }

        if (this.fetchPromise) {
            console.warn("Do not fetch data because a fetch is currently running on Datasource", dsState);
            return;
        }

        const fetchPromise = new Promise<any[]>((resolve, reject) => {
            this.dsInstance.fetchData(resolve, reject);

            setTimeout(() => {
                if (this.fetchPromise === fetchPromise) {
                    reject(new Error("Timeout! Datasource fetchData() took longer than 5 seconds."));
                }
            }, 5000);
        });

        this.fetchPromise = fetchPromise;

        fetchPromise.then((result) => {
            this.fetchPromise = null;
            if (!this.disposed) {
                //console.log("fetData plugin finished", dsState, result);
                if (result !== undefined) {
                    this.store.dispatch(Datasource.appendDatasourceData(dsState.id, result));
                }
            } else {
                console.error("fetchData of disposed plugin finished", dsState, result);
            }
        }).catch((error) => {
            console.warn("Failed to fetch data for Datasource " + dsState.type, dsState);
            console.error(error);
            this.fetchPromise = null;
        })
    }
}
