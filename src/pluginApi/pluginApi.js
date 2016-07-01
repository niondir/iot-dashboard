import * as PluginCache from './pluginCache'

window.iotDashboardApi = {
    registerDatasourcePlugin: PluginCache.registerDatasourcePlugin,
    registerWidgetPlugin: PluginCache.registerWidgetPlugin
};