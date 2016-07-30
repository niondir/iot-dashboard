/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from "chai"
import * as DatasourcePlugins from "./datasourcePlugins"
import DatasourcePluginRegistry from "./datasourcePluginRegistry"
import * as Store from "../store"
import * as AppState from "../appState"
import * as Sinon from "sinon"
import scriptloader from "../util/scriptLoader"
import * as pluginCache from "../pluginApi/pluginCache"
import {default as DataSourcePluginFactory} from "./datasourcePluginFactory"
import Dashboard from "../dashboard"
import SinonStub = Sinon.SinonStub


// TODO: Test Actions, Test Reducer
describe('Datasource > DatasourcePlugins', function () {

    let dashboard: Dashboard;
    let loadScriptStub: SinonStub;

    beforeEach(function () {
        loadScriptStub = Sinon.stub(scriptloader, "loadScript");
    });

    afterEach(function () {
        loadScriptStub.restore();
        if (dashboard) {
            dashboard.dispose();
        }
    });

    describe("plugin registration", function () {
        /* TODO: Testcases
         - load state with external plugin
         -- load from url works (DONE)
         -- load from url fails
         - load state with internal plugin

         - register external plugin
         -- load from url works
         -- load from url fails
         - register internal plugin
         */


        it("an external datasource plugin is loaded when it is already in state", function () {

            // TYPE_INFO and Datasource is usually created inside the plugin script
            const typeInfo = {type: "ext-ds"};
            const datasource = function (props: any) {
                return;
            };

            loadScriptStub.restore();
            loadScriptStub = Sinon.stub(scriptloader, "loadScript", function (scripts: string[], options: any) {
                pluginCache.registerDatasourcePlugin(typeInfo, datasource);

                // In reality the success function is called async
                // but then we to now know how long to wait to verify the plugin
                options.success();
            });
            loadScriptStub.withArgs(["fake/plugin.js"]);

            const stateWithExternalDatasource: AppState.State = Store.emptyState();
            stateWithExternalDatasource.datasourcePlugins = {
                "ext-ds": <DatasourcePlugins.IDatasourcePluginState>{
                    id: "ext-ds",
                    typeInfo: {type: "ext-ds"},
                    url: "fake/plugin.js",
                }
            };

            const store = Store.create(stateWithExternalDatasource, Store.testStoreOptions);
            const state = store.getState();
            dashboard = new Dashboard(store);
            dashboard.init();

            const plugin: DataSourcePluginFactory = dashboard.datasourcePluginRegistry.getPlugin("ext-ds");


            assert.isOk(loadScriptStub.calledOnce);
            assert.isOk(plugin, "The loaded plugin is okay");
            assert.equal(plugin.disposed, false, "The loaded plugin is not disposed");
            assert.deepEqual((<any>plugin)._plugins, {}, "The loaded plugin has no instances");
            assert.equal((<any>plugin)._store, store, "The loaded plugin knows the correct store");
            assert.equal((<any>plugin)._datasource, datasource, "The loaded plugin knows the datasouces");
            assert.equal(plugin.type, "ext-ds", "The loaded plugin knows the plugin type");

            assert.deepEqual(state.widgets, {}, "The new state has no widgets");
            assert.deepEqual(state.datasources, {}, "The new state has no datasources");
            assert.deepEqual(state.datasourcePlugins, {
                "ext-ds": {
                    "id": "ext-ds",
                    "typeInfo": {"type": "ext-ds"},
                    "url": "fake/plugin.js"
                }
            }, "The new state has the registered datasource plugin");
        });
        it("register internal plugin");
        it("a plugin is marked as defective when the external plugin was not loaded");
    });

    // TODO: consider moving to dashboard.test.ts?
    it("A datasource instance is created, when it is already in state", () => {

        const testDsPlugin = {
            TYPE_INFO: {type: "ds-with-instance-in-state"},
            Datasource: function (props: any) {
                return;
            }
        };

        loadScriptStub.restore();
        loadScriptStub = Sinon.stub(scriptloader, "loadScript", function (scripts: string[], options: any) {
            pluginCache.registerDatasourcePlugin(testDsPlugin.TYPE_INFO, testDsPlugin.Datasource);

            // In reality the success function is called async
            // but then we to now know how long to wait to verify the plugin
            options.success();
        });


        const initialState: AppState.State = Store.emptyState();
        initialState.datasourcePlugins = {
            "ds-with-instance-in-state": <DatasourcePlugins.IDatasourcePluginState>{
                id: "ds-with-instance-in-state",
                typeInfo: {type: "ds-with-instance-in-state"}
            }
        };
        initialState.datasources = {
            "ds-instance-in-state-id": {
                id: "ds-instance-in-state-id",
                type: "ds-with-instance-in-state",
                settings: {},
                data: [{ernie: "bert"}]
            }
        };

        const store = Store.create(initialState, Store.testStoreOptions);
        dashboard = new Dashboard(store);
        dashboard.init();

        const datasourcePluginFactory = dashboard.datasourcePluginRegistry.getPlugin("ds-with-instance-in-state");
        const datasourcePluginInstance = datasourcePluginFactory.getInstance("ds-instance-in-state-id");

        assert.isOk(datasourcePluginInstance, "The plugin instance is available");
    });


    describe('pluginRegistry #register() && #getPlugin()', function () {
        it("It's possible to register and get back a plugin", function () {
            const registry = new DatasourcePluginRegistry(Store.create());

            registry.register({
                TYPE_INFO: {
                    type: 'foo'
                },
                Datasource: function (props: any) {
                    return;
                }
            });

            const plugin = registry.getPlugin('foo');

            assert.isOk(plugin);
            assert.equal('foo', plugin.type);
        });
    });
});