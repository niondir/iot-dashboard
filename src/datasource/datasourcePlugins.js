
export class PluginRegistry {



    constructor() {
        this.datasources = {};
        this.instances = {};
    }

    register(module) {
        console.assert(module.TYPE_INFO, "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
        const dsPlugin = {
            ...module.TYPE_INFO,
            Datasource: module.Datasource,
            getOrCreateInstance: (dsState) => {
                let instance = this.instances[dsState.id];
                if (!instance) {
                    instance = new module.Datasource(dsState.props, dsState.data);
                    this.instances[dsState.id] = instance;
                }
                return instance;
            }
        };
        this.datasources[module.TYPE_INFO.type] = dsPlugin;
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
