import {DashboardStore} from "./store";
import {WidgetPluginRegistry} from "./widgets/widgetPlugins.js";
import {DatasourcePluginRegistry} from "./datasource/datasourcePlugins";
import * as Plugins from "./pluginApi/plugins.js";

/**
 * The root of the Dashboard business Logic
 * Defines the lifecycle of the Dashboard from creation till disposal
 */
export default class Dashboard {
    private static _instance: Dashboard;
    private _datasourcePluginRegistry: DatasourcePluginRegistry;
    private _widgetPluginRegistry: WidgetPluginRegistry;

    constructor(private _store: DashboardStore) {
        this._datasourcePluginRegistry = new DatasourcePluginRegistry(_store);
        this._widgetPluginRegistry = new WidgetPluginRegistry(_store);
    }

    get datasourcePluginRegistry() {
        return this._datasourcePluginRegistry;
    }

    get widgetPluginRegistry() {
        return this._widgetPluginRegistry;
    }

    public init() {
        Dashboard.setInstance(this);
        this._store.dispatch(Plugins.initializeExternalPlugins());
    }

    static setInstance(dashboard: Dashboard) {
        Dashboard._instance = dashboard;
    }

    /**
     * We have some code that depends on this global instance of the Dashboard
     * This is bad, but better that static references
     * we have at least the chance to influence the instance during tests
     *
     * @returns {Dashboard}
     */
    static getInstance() {
        if (!Dashboard._instance) {
            throw new Error("No global dashboard created. Call setInstance(dashboard) before!");
        }

        return Dashboard._instance;
    }
}