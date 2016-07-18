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

            let plugin = DatasourcePlugins.pluginRegistry.getPlugin('foo');

            assert.isOk(plugin);
            assert.equal('foo', plugin.type);
        });
    });
});