import * as FreeboardDatasource from './freeboardDatasource'
import * as Plugins from '../pluginApi/plugins'
import store from '../store'

function mapSettings(settings) {
    return settings.map(setting => {
        return {
            id: setting["name"],
            name: setting["display_name"],
            description: setting["description"],
            type: setting["type"],
            defaultValue: setting["default_value"],
            required: setting["required"]
        }
    })
}

const freeboardPluginApi = {

    loadDatasourcePlugin(plugin) {
        console.log("Loading freeboard Plugin: ", plugin);

        let typeName = plugin["type_name"];
        let displayName = plugin["display_name"];
        let description = plugin["description"];
        let externalScripts = plugin["external_scripts"];
        let settings = plugin["settings"];
        let newInstance = plugin["newInstance"];

        let TYPE_INFO = {
            type: typeName,
            name: displayName,
            description: description,
            dependencies: externalScripts,
            settings: mapSettings(settings)
        };

        let dsPlugin = {
            TYPE_INFO,
            Datasource: FreeboardDatasource.create(newInstance, TYPE_INFO)
        };

        store.dispatch(Plugins.loadPlugin(dsPlugin));
        
    }


};

window.freeboard = freeboardPluginApi;

export default freeboardPluginApi;