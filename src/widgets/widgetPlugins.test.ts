/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {assert} from 'chai'
import * as WidgetPlugins from './widgetPlugins.js'
import * as Store from '../store'



describe('Widget Plugins', function () {
    describe('#register() && #getWidget()', function () {
        it("It's possible to register and get back a plugin", function () {
            const store = Store.emptyState();
            const pluginRegistry = new WidgetPlugins.WidgetPluginRegistry(store);

            pluginRegistry.register({
                TYPE_INFO: {
                    type: 'foo'
                }
            });

            const plugin = pluginRegistry.getPlugin('foo');

            assert.isOk(plugin);
            assert.equal('foo', plugin.type);
        });
    });
});
