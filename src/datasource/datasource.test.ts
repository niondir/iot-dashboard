/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from "chai";
import * as Datasource from "./datasource";
import * as Store from "../store";
import * as Plugins from "../pluginApi/plugins.js";
import Dashboard from "../dashboard";

describe("Datasource > Datasource", function () {
    describe("api", function () {
        /**
         * For the Datasource API we have to consider different use cases how a Datasource wants to provide data:
         *  - Regular call to rest API
         *  - Forward incoming data from Websocket
         */

        /* TODO: Testcases
         - all plugin methods but getValues() are optional
         - all plugin methods are bound to the instance
         - getValues() is called on Store.get().dispatch(Datasource.fetchDatasourceData());
         - datasourceWillReceiveProps() is called when props change (e.g. after new data)
         -- We can avoid datasourceWillReceiveProps() by returning same data twice
         -- TODO: should we have some dataStore with nice API to replace, append, pop data?
         - dispose() is called when the datasource is unloaded
         - fetchData() is called as configured in the settings
         -- fetchData(dataStore) can return a promise or a value - must be an array
         - Error when loading plugin twice
         */

        it("datasource must implement getValues()", function () {
            const DatasourcePlugin = {
                TYPE_INFO: {type: "test-ds"},
                Datasource: function (props: any) {
                    return;
                }
            };

            const store = Store.createEmpty({log: true});
            const dashboard = new Dashboard(store);
            dashboard.init();

            store.dispatch(Plugins.loadPlugin(DatasourcePlugin));
            try {
                store.dispatch(Datasource.createDatasource("test-ds", {}, "ds-id"));
                assert.fail("Creating a datasource should fail because of missing getValues()")
            }
            catch (e) {
                assert.equal(e.message, 'Datasource must implement "getValues(): any[]" but is missing. {"id":"ds-id","type":"test-ds"}');
            }
        });
        it("fetchData() is called as configured in the settings", function () {

            const DatasourcePlugin = {
                TYPE_INFO: {
                    type: "test-ds",
                    fetchData: {
                        interval: 1000
                    }
                },
                Datasource: function (props: any) {
                    this.getValues = function():any[] {
                        return [];
                    };
                    this.fetchData = (resolve: ResolveFunc<any[]>) => {
                        resolve([1, 2, 3]);
                    };
                }
            };

            // TODO: new store but old state outside of the store :(
            const store = Store.createEmpty({log: true});
            const dashboard = new Dashboard(store);
            dashboard.init();
            store.dispatch(Plugins.loadPlugin(DatasourcePlugin));
            store.dispatch(Datasource.createDatasource("test-ds", {}, "ds-id"));

        })
    });
});

interface ResolveFunc<T> {
    (value?: T | Thenable<T>): void
}