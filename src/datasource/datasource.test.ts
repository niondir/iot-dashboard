/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from "chai";
import * as Datasource from "./datasource";
import * as Store from "../store";
import {DashboardStore} from "../store";
import * as Plugins from "../pluginApi/plugins";
import Dashboard from "../dashboard";

describe("Datasource > Datasource", function () {

    let store: DashboardStore;
    let dashboard: Dashboard;

    beforeEach(() => {
        store = Store.createEmpty(Store.testStoreOptions);
        dashboard = new Dashboard(store);
    });

    afterEach(() => {
        dashboard.dispose();
    });

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

        it("fetchData() is called as configured in the settings", function () {

            const datasourcePlugin = {
                TYPE_INFO: {
                    type: "test-ds",
                    fetchData: {
                        interval: 1000
                    }
                },
                Datasource: function (props: any) {
                    this.getValues = function (): any[] {
                        return [];
                    };
                    this.fetchData = (resolve: ResolveFunc<any[]>) => {
                        resolve([1, 2, 3]);
                    };
                }
            };

            dashboard.init();
            store.dispatch(Plugins.loadPlugin(datasourcePlugin));
            store.dispatch(Datasource.createDatasource("test-ds", {}, "ds-id"));

            const pluginFactory = dashboard.datasourcePluginRegistry.getPlugin("test-ds");
            const plugin = pluginFactory.getInstance("ds-id");

            assert.isOk(plugin, "Datasource plugin is registered in the registry");


        });
    });
});

interface ResolveFunc<T> {
    (value?: T | Thenable<T>): void
}