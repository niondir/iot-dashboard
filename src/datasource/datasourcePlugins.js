import * as DsPlugin from './datasourcePlugin'

export class PluginRegistry {


    constructor() {
        this.datasources = {};
    }

    set store(store) {
        this._store = store;
    }

    register(module) {
        if (!this._store === undefined) {
            throw new Error("PluginRegistry has no store. Set the store property before registering modules!");
        }

        console.log("registering plugin: ", module);
        const dsPlugin = new DsPlugin.DataSourcePlugin(module, this._store);
        this.datasources[dsPlugin.type] = dsPlugin;
    }

    getPlugin(type:String) {
        return this.datasources[type];
    }


    getPlugins() {
        return {...this.datasources};
    }
}


const DatasourcePlugins = new PluginRegistry();
export default DatasourcePlugins;
