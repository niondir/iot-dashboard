import PluginRegistry from "../pluginApi/pluginRegistry";
import DataSourcePluginFactory from "./datasourcePluginFactory";
import {IPluginModule} from "../pluginApi/pluginRegistry";
import {IDatasourcePlugin} from "./datasourcePluginFactory";
import {DashboardStore} from "../store";
import {IDatasourceState, appendDatasourceData} from "./datasource";
import {IDatasourcePluginState} from "./datasourcePlugins";

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
            this.doFetchData()
        }, 1000)
    }

    get disposed() {
        return this._disposed
    }

    /**
     * Create instances for all plugins that are in the store
     */
    initializePluginInstances() {
        const dsStates = this.store.getState().datasources;

        _.valuesIn<IDatasourceState>(dsStates).forEach((dsState) => {
            const pluginFactory = this.getPlugin(dsState.type);
            pluginFactory.createInstance(dsState.id);

        })
    }

    createPluginFromModule(module: IDatasourcePluginModule) {
        console.assert(_.isObject(module.TYPE_INFO), "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
        return new DataSourcePluginFactory(module.TYPE_INFO.type, module.Datasource, this.store);
    }

    doFetchData() {
        const datasourcePluginStates = this.store.getState().datasourcePlugins;
        const datasourceStates = this.store.getState().datasources;

        // It is important that we only call fetch on Datasources and Plugins that are also in the Store!
        // Else you could have ugly side effects when something runs out of sync with the store
        _.valuesIn<IDatasourcePluginState>(datasourcePluginStates).forEach((dsPluginState) => {
            const dsPluginFactory = this.getPlugin(dsPluginState.id);
            _.valuesIn<IDatasourceState>(datasourceStates).forEach((dsState) => {
                const dsPlugin = dsPluginFactory.getInstance(dsState.id);
                this.doFetchDataForDatasourceInstance(dsPlugin, dsState);
            })
        });
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
        const fetchPromise = new Promise<any[]>((resolve, reject) => {
            dsInstance.fetchData(resolve, reject);
            // TODO: Implement a timeout?
        });

        this._fetchPromises[dsState.id] = fetchPromise;

        fetchPromise.then((result) => {
            console.log("_fetchPromises => null");
            this._fetchPromises[dsState.id] = null;
            if (!this._disposed) {
                //console.log("fetData plugin finished", dsState, result);
                this.store.dispatch(appendDatasourceData(dsState.id, result));
            } else {
                console.error("fetData of disposed plugin finished", dsState, result);
            }
        }).catch(() => {
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