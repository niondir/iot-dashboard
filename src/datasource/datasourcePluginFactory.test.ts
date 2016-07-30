/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from "chai";
import * as Store from "../store";
import {DashboardStore} from "../store";
import {IDatasourceInstance, default as DataSourcePluginFactory} from "./datasourcePluginFactory";
import SinonStub = Sinon.SinonStub;
import SinonFakeTimers = Sinon.SinonFakeTimers;

describe("Datasource > DatasourcePluginFactory", function () {

    let store: DashboardStore;

    beforeEach(() => {
        store = Store.createEmpty(Store.testStoreOptions);
    });

    it("can not create datasource plugin instance of a datasource that is not in the store", function () {

        const PluginImpl = function (props: any): IDatasourceInstance {
            this.fetchData = function (resolve: any, reject: any) {
                assert.fail(true, false, "fetchData must not be called");
            };
            return {}
        };

        const dsPlugin = new DataSourcePluginFactory("test-ds-plugin-type", PluginImpl, store);

        try {
            dsPlugin.createInstance("plugin-instance");
            assert.fail("createInstance must throw an error");
        } catch (e) {
            assert.equal('Can not get state of non existing datasource with id plugin-instance', e.message)
        }

    });
})
;