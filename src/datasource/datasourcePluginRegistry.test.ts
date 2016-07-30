/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


import {assert} from "chai";
import {appendDatasourceData} from "./datasource";
import * as Store from "../store";
import {DashboardStore} from "../store";
import {IDatasourcePlugin} from "./datasourcePluginFactory";
import * as Sinon from "sinon";
import DatasourcePluginRegistry from "./datasourcePluginRegistry";
//import SinonFakeTimers = Sinon.SinonFakeTimers;

describe("Datasource > DatasourcePluginRegistry", function () {

    let store: DashboardStore;
    let datasourcePluginRegistry: DatasourcePluginRegistry;
    //let clock: SinonFakeTimers;

    beforeEach(() => {
        //clock = Sinon.useFakeTimers();
        store = Store.createEmpty(Store.testStoreOptions);
        datasourcePluginRegistry = new DatasourcePluginRegistry(store);
    });

    afterEach(() => {
        if (datasourcePluginRegistry && !datasourcePluginRegistry.disposed) {
            datasourcePluginRegistry.dispose();
        }
        //clock.restore();
    });

    it("it is possible to register a plugin", function () {
        const TYPE_INFO = {
            type: "test-ds-plugin-1"
        };
        class PluginImpl implements IDatasourcePlugin {
            public props: any;

            fetchData(resolve: any, reject: any) {
                resolve([]);
            }
        }

        datasourcePluginRegistry.register({TYPE_INFO, Datasource: PluginImpl});

        const registeredPlugin = datasourcePluginRegistry.getPlugin("test-ds-plugin-1");

        assert.isOk(registeredPlugin, "The registered plugin can be fetched from the registry");
        assert.equal("test-ds-plugin-1", registeredPlugin.type, "The registered plugin has the correct type");
        assert.isFalse(registeredPlugin.disposed, "The registered plugin is not disposed");
    });


    it("register and fetchData happy path", function () {
        const dispatchStub = Sinon.stub(store, "dispatch");
        const getStateStub = Sinon.stub(store, "getState");
        const doFetchDataSpy = Sinon.spy(datasourcePluginRegistry, "doFetchData");


        // The plugin id is the plugin type
        const PLUGIN_TYPE = "happy-test-ds-plugin-type";
        const DS_PLUGIN_ID = "happy-plugin-instance-id";
        getStateStub.returns(_.assign(Store.emptyState(),
            {
                datasourcePlugins: {
                    "happy-test-ds-plugin-type": {
                        id: PLUGIN_TYPE
                    }
                },
                datasources: {
                    "happy-plugin-instance-id": {
                        id: DS_PLUGIN_ID
                    }
                }
            }));

        const datasourcePlugin = {
            TYPE_INFO: {
                type: PLUGIN_TYPE
            },
            Datasource: class PluginImpl implements IDatasourcePlugin {
                public props: any;

                fetchData(resolve: any, reject: any) {
                    resolve(["a"]);
                }
            }
        };

        datasourcePluginRegistry.register(datasourcePlugin);

        const dsPlugin = datasourcePluginRegistry.getPlugin(PLUGIN_TYPE);

        const dsInstance = dsPlugin.createInstance(DS_PLUGIN_ID);

        // This fakes the waiting for the next timeout. So we do not need fake timers here.
        datasourcePluginRegistry.doFetchData();
        //clock.tick(1000);

        const fetchPromise = (<any>datasourcePluginRegistry)._fetchPromises[DS_PLUGIN_ID];
        assert.isOk(fetchPromise, "There is is valid fetch promise to wait for");
        assert.isOk(dsInstance, "a datasource instance was created");
        assert.equal(1, doFetchDataSpy.callCount, "doFetchData() was called once");
        assert.isOk((<any>datasourcePluginRegistry)._fetchIntervalRef, "datasourcePluginRegistry._fetchIntervalRef must be set");
        assert.isFalse(datasourcePluginRegistry.disposed, "datasourcePluginRegistry is not disposed");

        return fetchPromise.then(() => {
            assert.equal(1, dispatchStub.callCount, "dispatch was called once after data was fetched");
            assert.isTrue(dispatchStub.calledWith(appendDatasourceData(DS_PLUGIN_ID, ["a"])), "dispatch was called with the expected argument");
            assert.isNull((<any>datasourcePluginRegistry)._fetchPromises[DS_PLUGIN_ID], "fetchPromise must be null after it was resolved");
        });

    })
});
