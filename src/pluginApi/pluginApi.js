
let pluginCache = null;

export function registerDatasourcePlugin(typeInfo, Datasource) {
    console.assert(!hasPlugin(), "Plugin must be finished loaded before another can be registered");
    pluginCache = ({
        TYPE_INFO: typeInfo,
        Datasource
    });
}

export function popLoadedPlugin() {
    let plugin = pluginCache;
    pluginCache = null;
    return plugin;
}

export function hasPlugin() {
    return pluginCache !== null;
}

window.iotDashboardApi = {
    registerDatasourcePlugin: registerDatasourcePlugin
};