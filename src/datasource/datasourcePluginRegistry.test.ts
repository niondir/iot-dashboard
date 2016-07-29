/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


import {assert} from "chai";
import * as Datasource from "./datasource";
import * as Store from "../store";
import * as Plugins from "../pluginApi/plugins.js";
import Dashboard from "../dashboard";
import {IDatasourceInstance} from "./datasourcePluginFactory";
import * as Sinon from "sinon";
import SinonStub = Sinon.SinonStub;
import {appendDatasourceData} from "./datasource";
import DatasourcePluginRegistry from "./datasourcePluginRegistry";

describe("Datasource > DatasourcePluginRegistry", function () {

    it("register and fetchData happy path", function (done) {
        const TYPE_INFO = {
            type: "test-ds-plugin"
        };
        class PluginImpl implements IDatasourceInstance {
            public props: any;

            fetchData(resolve: any, reject: any) {
                resolve(["a"]);
            }
        }

        const store = Store.createEmpty();
        const clock = Sinon.useFakeTimers();

        const dispatchStub = Sinon.stub(store, "dispatch");
        const datasourcePluginRegistry = new DatasourcePluginRegistry(store);

        datasourcePluginRegistry.register({TYPE_INFO, Datasource: PluginImpl});


        const dsPlugin = datasourcePluginRegistry.getPlugin("test-ds-plugin");

        const dsInstance = dsPlugin.createInstance("plugin-instance");
        clock.tick(3000);

        datasourcePluginRegistry.dispose();

        // We need to restore the clock and check asserts asnyc, strange bug in Sinon (or Chrome?) or something else?
        clock.restore();
        setTimeout(() => {
            assert.isOk(dsInstance, "a datasource instance was created");
            assert.equal(1, dispatchStub.callCount, "dispatch was called once after data was fetched");
            assert.equal(1, dispatchStub.calledWith(appendDatasourceData("test-ds-id", ["a"])), "dispatch was called with the expected argument");
            assert.isNull((<any>datasourcePluginRegistry)._fetchPromises, "fetchPromise must be null after it was resolved");
            assert.isNumber((<any>datasourcePluginRegistry)._fetchIntervalRef, "datasourcePluginRegistry._fetchIntervalRef must be set");
            assert.isTrue(datasourcePluginRegistry.disposed, "datasourcePluginRegistry is disposed");
            done();
        });

    })
});
