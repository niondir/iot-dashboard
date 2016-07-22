/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from 'chai'
import * as DatasourcePlugins from './datasourcePlugins'
import * as Store from '../store'


describe('Datasource Plugins', function () {
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