import PluginRegistry from "../pluginApi/pluginRegistry";
import DataSourcePluginFactory from "./datasourcePluginFactory";
import {IPluginModule} from "../pluginApi/pluginRegistry";
import {IDatasourceInstance} from "./datasourcePluginFactory";
import {DashboardStore} from "../store";
import {IDatasourceState, appendDatasourceData} from "./datasource";
import {IDatasourcePluginState} from "./datasourcePlugins";

/**
 * Describes how we expect the plugin module to be
 */
interface IDatasourcePluginModule extends IPluginModule {
    Datasource: any
}

export default class DatasourcePluginRegistry extends PluginRegistry<IDatasourceInstance, IDatasourcePluginModule, DataSourcePluginFactory> {

    private _fetchIntervalRef: number;
    private _fetchPromises: {[dsStateId: string]: Promise<any[]>} = {};
    private _disposed: boolean = false;

    constructor(_store: DashboardStore) {
        super(_store);

        this._fetchIntervalRef = setInterval(() => {
            this.doFetchData()
        }, 2000)
    }

    get disposed() {
        return this._disposed
    }

    createPluginFromModule(module: IDatasourcePluginModule) {
        console.assert(_.isObject(module.TYPE_INFO), "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
        return new DataSourcePluginFactory(module.TYPE_INFO.type, module.Datasource, this.store);
    }

    doFetchData() {
        const datasourcePluginStates = this.store.getState().datasourcePlugins;
        const datasourceStates = this.store.getState().datasources;

        _.valuesIn<IDatasourcePluginState>(datasourcePluginStates).forEach((dsPluginState) => {
            const dsPluginFactory = this.getPlugin(dsPluginState.id);
            _.valuesIn<IDatasourceState>(datasourceStates).forEach((dsState) => {
                const dsPlugin = dsPluginFactory.getInstance(dsState.id);
                this.doFetchDataForDatasourceInstance(dsPlugin, dsState);
            })
        });
    }

    doFetchDataForDatasourceInstance(dsInstance: IDatasourceInstance, dsState: IDatasourceState) {
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
            this._fetchPromises[dsState.id] = null;
            if (!this._disposed) {
                this.store.dispatch(appendDatasourceData(dsState.id, result));
            }
        }).catch(() => {
            this._fetchPromises[dsState.id] = null;
        })
    }

    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            clearInterval(this._fetchIntervalRef);
        }
    }
}