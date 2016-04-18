import {assert} from 'chai'
import DatasourcePlugins from './datasourcePlugins'

describe('Datasource Plugins', function () {
    describe('#register() && #getDatasource()', function () {
        it("It's possible to register and get back a plugin", function () {
            DatasourcePlugins.register({
                TYPE_INFO: {
                    type: 'foo'
                }
            });

            let plugin = DatasourcePlugins.getDatasource('foo');

            assert.isOk(plugin);
            assert.equal('foo', plugin.type);
        });
    });
});