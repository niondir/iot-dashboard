/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from 'chai'
import * as DatasourcePlugins from './datasourcePlugins'
import * as Store from '../store'
import * as AppState from '../appState'


const stateWithExternalDatasource: AppState.State = Store.emptyState;
stateWithExternalDatasource.datasourcePlugins = {
    "ext-ds": <DatasourcePlugins.IDatasourcePluginState>{
        id: "ext-ds",
        typeInfo: {},
        url: "fake/plugin.js",
        isDatasource: true,
        isWidget: false
    }
};

describe('Datasource Plugins', function () {

    describe("plugin registration", function () {
        it("a external plugin is loaded when it is already in state", function () {
            const store = Store.create(stateWithExternalDatasource, {log: true});

            // TODO: mock & verify the script loading and fake the API call of the plugin

            const plugin = DatasourcePlugins.pluginRegistry.getPlugin("ext-ds");
            // TODO: ensure that the script is only registered once, there should be no warning in the log
            assert.isOk(plugin)

        });
        it("a plugin is marked as defective when the external plugin was not loaded");
    });

    describe('#register() && #getPlugin()', function () {
        it("It's possible to register and get back a plugin", function () {
            DatasourcePlugins.pluginRegistry.store = Store.create();
            DatasourcePlugins.pluginRegistry.register({
                TYPE_INFO: {
                    type: 'foo'
                }
            });

            const plugin = DatasourcePlugins.pluginRegistry.getPlugin('foo');

            assert.isOk(plugin);
            assert.equal('foo', plugin.type);
        });
    });
});