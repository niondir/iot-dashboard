import {DashboardStore} from "./store";
import {WidgetPluginRegistry} from "./widgets/widgetPlugins.js";
import DatasourcePluginRegistry from "./datasource/datasourcePluginRegistry";
import * as Plugins from "./pluginApi/plugins.js";
import {IDatasourcePluginModule} from "./datasource/datasourcePluginRegistry";

/**
 * The root of the Dashboard business Logic
 * Defines the lifecycle of the Dashboard from creation till disposal
 */
export default class Dashboard {
    private static _instance: Dashboard;
    private _datasourcePluginRegistry: DatasourcePluginRegistry;
    private _widgetPluginRegistry: WidgetPluginRegistry;
    private _initialized: boolean = false;

    constructor(private _store: DashboardStore, private _initialDatasourcePlugins?: IDatasourcePluginModule[]) {
        this._datasourcePluginRegistry = new DatasourcePluginRegistry(_store);
        this._widgetPluginRegistry = new WidgetPluginRegistry(_store);
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

    get datasourcePluginRegistry() {
        return this._datasourcePluginRegistry;
    }

    get widgetPluginRegistry() {
        return this._widgetPluginRegistry;
    }

    public init() {
        if (this._initialized) {
            throw new Error("Dashboard was already initialized. Can not call init() twice.");
        }
        this._initialized = true;
        Dashboard.setInstance(this);

        // First load all build-in plugins
        if (this._initialDatasourcePlugins) {
            this._initialDatasourcePlugins.forEach((dsPlugin) => {
                this._datasourcePluginRegistry.register(dsPlugin);
            })
        }

        // There might be external plugins that need to be loaded from the web
        this._store.dispatch(Plugins.initializeExternalPlugins());


        // When all plugins are loaded we can create all known instances for them
        this._datasourcePluginRegistry.initializePluginInstances();

    }

    dispose() {
        this._datasourcePluginRegistry.dispose();
        // TODO: this._widgetPluginRegistry.dispose();
    }
}