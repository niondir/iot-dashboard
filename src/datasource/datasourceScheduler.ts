/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {DashboardStore} from "../store";
import {DatasourcePluginInstance} from "./datasourcePluginInstance";
import * as Datasource from "./datasource";

export class DatasourceScheduler {

    private _fetchInterval: number = 1000;
    private fetchPromise: Promise<any>;
    private fetchTimeoutRef: number;
    private disposed = false;
    private running = false;


    constructor(private dsInstance: DatasourcePluginInstance, private store: DashboardStore) {
    }

    set fetchInterval(ms: number) {
        this._fetchInterval = ms;
        this.clearFetchTimeout();
        this.scheduleFetch();
    }


    start() {
        this.running = true;
        this.scheduleFetch();
    }

    dispose() {
        this.clearFetchTimeout();
        this.disposed = true;
        this.running = false;
    }

    private scheduleFetch() {
        if (!this.running) {
            return;
        }
        this.fetchTimeoutRef = setTimeout(() => {
            this.doFetchData();
        }, this._fetchInterval)
    }

    private clearFetchTimeout() {
        if (this.fetchTimeoutRef) {
            clearTimeout(this.fetchTimeoutRef);
            this.fetchTimeoutRef = null;
        }
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
                    this.store.dispatch(Datasource.fetchedDatasourceData(dsState.id, result));
                }

                this.scheduleFetch();
            } else {
                console.error("fetchData of disposed plugin finished - result discarded", dsState, result);
            }
        }).catch((error) => {
            console.warn("Failed to fetch data for Datasource " + dsState.type, dsState);
            console.error(error);
            this.fetchPromise = null;
        })
    }
}
