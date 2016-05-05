import DatasourcePlugins from '../datasource/datasourcePlugins'

export function registerDatasourcePlugin(typeInfo, Datasource) {
    DatasourcePlugins.register({
            TYPE_INFO: typeInfo,
            Datasource
        }
    )

}

window.iotDashboardApi = {
    registerDatasourcePlugin: registerDatasourcePlugin
};