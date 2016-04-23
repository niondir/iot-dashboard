
export class PluginRegistry {



    constructor() {
        this.datasources = {};
        this.instances = {};
    }

    register(module) {
        console.assert(module.TYPE_INFO, "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
        this.datasources[module.TYPE_INFO.type] = {
            ...module.TYPE_INFO,
            Datasource: module.Datasource,
            getOrCreateInstance: (id) => {
                let instance = this.instances[id];
                if (!instance) {
                    instance = new module.Datasource();
                    this.instances[id] = instance;
                }
                return instance;
            }
        }
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
