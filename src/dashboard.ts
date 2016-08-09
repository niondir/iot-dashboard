import {DashboardStore} from "./store";
import {WidgetPluginRegistry} from "./widgets/widgetPlugins.js";
import DatasourcePluginRegistry, {IDatasourcePluginModule} from "./datasource/datasourcePluginRegistry";
import * as _ from "lodash";
import * as Plugins from "./pluginApi/plugins";
import * as PluginCache from "./pluginApi/pluginCache";
import scriptloader from "./util/scriptLoader";
import * as URI from "urijs";
import {IDatasourcePluginState} from "./datasource/datasourcePlugins";
import {IPluginModule} from "./pluginApi/pluginRegistry";

/**
 * The root of the Dashboard business Logic
 * Defines the lifecycle of the Dashboard from creation till disposal
 */
export default class Dashboard {
    private static _instance: Dashboard;
    private _datasourcePluginRegistry: DatasourcePluginRegistry;
    private _widgetPluginRegistry: WidgetPluginRegistry;
    private _initialized: boolean = false;

    private _scriptsLoading: {[url: string]: Promise<void>} = {};

    constructor(private _store: DashboardStore) {
        this._datasourcePluginRegistry = new DatasourcePluginRegistry(_store);
        this._widgetPluginRegistry = new WidgetPluginRegistry(_store);

        _store.subscribe(() => {
            // Whenever a datasource is added that is still loading, we create an instance and update the loading state
            const state = _store.getState();

            state.pluginLoader.loadingUrls.forEach((urlToLoad) => {
                if (!this._scriptsLoading[urlToLoad]) {
                    this.loadPluginScript(urlToLoad);
                }
            });
        })
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
        Dashboard.setInstance(this); // TODO: still needed?

        const state = this._store.getState();
        const plugins = _.valuesIn<IDatasourcePluginState>(state.datasourcePlugins)
            .concat(_.valuesIn<any>(state.widgetPlugins));  // TODO: type IWidgetPluginState

        plugins.forEach(plugin => {
            this._store.dispatch(Plugins.startLoadingPluginFromUrl(plugin.id, plugin.url));
        });
    }

    dispose() {
        this._datasourcePluginRegistry.dispose();
        // TODO: this._widgetPluginRegistry.dispose();
    }

    private loadPluginScript(url: string): Promise<void> {
        const loadScriptsPromise = scriptloader.loadScript([url]);

        loadScriptsPromise.catch((error) => {
            console.warn("Failed to load script: " + error.message)
        })

        this._scriptsLoading[url] = loadScriptsPromise.then(() => {
                if (PluginCache.hasPlugin()) {
                    // TODO: use a reference to the pluginCache and only bind that instance to the window object while the script is loaded
                    // TODO: The scriploader can ensure that only one script is loaded at a time
                    const plugin = PluginCache.popLoadedPlugin();
                    return this.loadPluginScriptDependencies(plugin, url);
                }
                else {
                    return Promise.reject(new Error("Failed to load Plugin. Make sure it called window.iotDashboardApi.register***Plugin from url " + url));
                }
            })
            .then((plugin: IPluginModule) => {
                if ((<IDatasourcePluginModule>plugin).Datasource) {
                    this._datasourcePluginRegistry.registerDatasourcePlugin((<IDatasourcePluginModule>plugin), url);
                }
                else if ((<any>plugin).Widget) {
                    this._widgetPluginRegistry.register(plugin);
                    this._store.dispatch(Plugins.widgetPluginFinishedLoading(plugin, url));
                }

                delete this._scriptsLoading[url];
                return Promise.resolve<void>();
            });
        /*.catch((error) => {
         console.error(error.message);
         delete this._scriptsLoading[url];
         throw error;
         }); */

        return this._scriptsLoading[url];
    }

    private loadPluginScriptDependencies(plugin: any, url: string): Promise<IPluginModule> {
        const dependencies: string[] = plugin.TYPE_INFO.dependencies;
        if (_.isArray(dependencies) && dependencies.length !== 0) {

            const dependencyPaths = dependencies.map(dependency => {
                return URI(dependency).absoluteTo(url).toString();
            });

            console.log("Loading Dependencies for Plugin", dependencyPaths);
            return scriptloader.loadScript(dependencyPaths).then(() => {
                return Promise.resolve(plugin);
            });
        }
        else {
            return Promise.resolve(plugin);
        }

    }


}
