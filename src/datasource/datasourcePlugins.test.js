import {assert} from 'chai'
import DatasourcePlugins from './datasourcePlugins'
import store from '../store'


describe('Datasource Plugins', function () {
    describe('#register() && #getPlugin()', function () {
        it("It's possible to register and get back a plugin", function () {
            DatasourcePlugins.store = store;
            DatasourcePlugins.register({
                TYPE_INFO: {
                    type: 'foo'
                }
            });

            let plugin = DatasourcePlugins.getPlugin('foo');

            assert.isOk(plugin);
            assert.equal('foo', plugin.type);
        });
    });
});