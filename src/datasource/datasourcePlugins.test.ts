/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from "chai";
import * as DatasourcePlugins from "./datasourcePlugins";
import DatasourcePluginRegistry from "./datasourcePluginRegistry";
import * as Store from "../store";
import * as AppState from "../appState";
import * as Sinon from "sinon";
import scriptloader from "../util/scriptLoader";
import * as pluginCache from "../pluginApi/pluginCache.js";
import {default as DataSourcePluginFactory} from "./datasourcePluginFactory";
import Dashboard from "../dashboard";
import SinonStub = Sinon.SinonStub;

const stateWithExternalDatasource: AppState.State = Store.emptyState();
stateWithExternalDatasource.datasourcePlugins = {
    "ext-ds": <DatasourcePlugins.IDatasourcePluginState>{
        id: "ext-ds",
        typeInfo: {type: "ext-ds"},
        url: "fake/plugin.js",
        isDatasource: true,
        isWidget: false
    }
};

// TODO: Test Actions, Test Reducer
describe('Datasource > DatasourcePlugins', function () {

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

        let loadScriptStub: SinonStub;

        beforeEach(function () {
            loadScriptStub = Sinon.stub(scriptloader, "loadScript");
        });

        afterEach(function () {
            loadScriptStub.restore()
        });


        it("an external plugin is loaded when it is already in state", function () {

            // TYPE_INFO and Datasource is usually created inside the plugin script
            const TYPE_INFO = {type: "ext-ds"};
            const Datasource = function (props: any) {
                return;
            };

            // Restore
            loadScriptStub.restore();
            loadScriptStub = Sinon.stub(scriptloader, "loadScript", function (scripts: string[], options: any) {
                pluginCache.registerDatasourcePlugin(TYPE_INFO, Datasource);

                // In reality the success function is called async
                // but then we to now know how long to wait to verify the plugin
                options.success();
            });
            loadScriptStub.withArgs(["fake/plugin.js"]);

            const store = Store.create(stateWithExternalDatasource, Store.testStoreOptions);
            const state = store.getState();
            const dashboard = new Dashboard(store);
            dashboard.init();

            const plugin: DataSourcePluginFactory = dashboard.datasourcePluginRegistry.getPlugin("ext-ds");


            assert.isOk(loadScriptStub.calledOnce);
            assert.isOk(plugin, "The loaded plugin is okay");
            assert.equal(plugin.disposed, false, "The loaded plugin is not disposed");
            assert.deepEqual((<any>plugin)._plugins, {}, "The loaded plugin has no instances");
            assert.equal((<any>plugin)._store, store, "The loaded plugin knows the correct store");
            assert.equal((<any>plugin)._datasource, Datasource, "The loaded plugin knows the datasouces");
            assert.equal(plugin.type, "ext-ds", "The loaded plugin knows the plugin type");

            assert.deepEqual(state.widgets, {}, "The new state has no widgets");
            assert.deepEqual(state.datasources, {}, "The new state has no datasources");
            assert.deepEqual(state.datasourcePlugins, {
                "ext-ds": {
                    "id": "ext-ds",
                    "typeInfo": {"type": "ext-ds"},
                    "url": "fake/plugin.js",
                    "isDatasource": true,
                    "isWidget": false
                }
            }, "The new state has the registered datasource plugin");
        });
        it("register internal plugin");
        it("a plugin is marked as defective when the external plugin was not loaded");
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