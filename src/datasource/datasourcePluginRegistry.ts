import PluginRegistry, {IPluginModule} from "../pluginApi/pluginRegistry";
import DataSourcePluginFactory, {IDatasourcePlugin} from "./datasourcePluginFactory";
import {DashboardStore} from "../store";
import {IDatasourceState, appendDatasourceData} from "./datasource";
import * as Plugins from "../pluginApi/plugins";

/**
 * Describes how we expect the plugin module to be
 */
export interface IDatasourcePluginModule extends IPluginModule {
    Datasource: IDatasourcePlugin
}

export default class DatasourcePluginRegistry extends PluginRegistry<IDatasourcePluginModule, DataSourcePluginFactory> {

    private _fetchIntervalRef: number;
    private _fetchPromises: {[dsStateId: string]: Promise<any[]>} = {};
    private _disposed: boolean = false;

    constructor(_store: DashboardStore) {
        super(_store);

        this._fetchIntervalRef = setInterval(() => {
            this.doFetchData();
        }, 1000);
    }

    get disposed() {
        return this._disposed
    }

    registerDatasourcePlugin(plugin: IDatasourcePluginModule, url: string) {
        super.register(plugin);

        this.store.dispatch(Plugins.datasourcePluginFinishedLoading((<IDatasourcePluginModule>plugin), url));
    }


    createPluginFromModule(module: IDatasourcePluginModule) {
        console.assert(_.isObject(module.TYPE_INFO), "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
        return new DataSourcePluginFactory(module.TYPE_INFO.type, module.Datasource, this.store);
    }

    doFetchData() {
        if (this._disposed) {
            throw new Error("DatasourcePluginRegistry is disposed. Can not fetch data.");
        }
        const datasourceStates = this.store.getState().datasources;

        _.valuesIn<IDatasourceState>(datasourceStates).forEach((dsState) => {
            const dsPluginFactory = this.getPlugin(dsState.type);
            const dsPlugin = dsPluginFactory.getInstance(dsState.id);
            this.doFetchDataForDatasourceInstance(dsPlugin, dsState);
        })
    }

    doFetchDataForDatasourceInstance(dsInstance: IDatasourcePlugin, dsState: IDatasourceState) {
        if (this._fetchPromises[dsState.id]) {
            console.warn("Do not fetch data because a fetch is currently running on Datasource", dsState);
            return;
        }
        if (!dsInstance.fetchData) {
            console.warn("fetchData(resolve, reject) is not implemented in Datasource ", dsState);
            return;
        }

        if (this._fetchPromises[dsState.id]) {
            console.log("Fetch already in progress, returning", dsState)
            return;
        }

        const fetchPromise = new Promise<any[]>((resolve, reject) => {
            dsInstance.fetchData(resolve, reject);
            // TODO: Implement a timeout?
        });

        this._fetchPromises[dsState.id] = fetchPromise;

        fetchPromise.then((result) => {
            this._fetchPromises[dsState.id] = null;
            if (!this._disposed) {
                //console.log("fetData plugin finished", dsState, result);
                this.store.dispatch(appendDatasourceData(dsState.id, result));
            } else {
                console.error("fetData of disposed plugin finished", dsState, result);
            }
        }).catch((error) => {
            console.warn("Failed to fetch data for Datasource " + dsState.type, dsState);
            console.error(error);
            this._fetchPromises[dsState.id] = null;
        })
    }

    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            clearInterval(this._fetchIntervalRef);
            this._fetchIntervalRef = null;
        }
    }
}