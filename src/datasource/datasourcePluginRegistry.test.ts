/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


import {assert} from "chai";
import * as Store from "../store";
import {IDatasourcePlugin} from "./datasourcePluginFactory";
import DatasourcePluginRegistry from "./datasourcePluginRegistry";

describe("Datasource > DatasourcePluginRegistry", function () {

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
        const store = Store.createEmpty(Store.testStoreOptions());
        const datasourcePluginRegistry = new DatasourcePluginRegistry(store);

        afterEach(() => {
            datasourcePluginRegistry.dispose();
        });

        datasourcePluginRegistry.register({TYPE_INFO, Datasource: PluginImpl});

        const registeredPlugin = datasourcePluginRegistry.getPlugin("test-ds-plugin-1");

        assert.isOk(registeredPlugin, "The registered plugin can be fetched from the registry");
        assert.equal("test-ds-plugin-1", registeredPlugin.type, "The registered plugin has the correct type");
        assert.isFalse(registeredPlugin.disposed, "The registered plugin is not disposed");
    });

});
