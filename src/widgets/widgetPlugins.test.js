import {assert} from 'chai'
import WidgetPlugins from './widgetPlugins'


describe('Widget Plugins', function () {
    describe('#register() && #getWidget()', function () {
        it("It's possible to register and get back a plugin", function () {
            WidgetPlugins.register({
                TYPE_INFO: {
                    type: 'foo'
                }
            });

            let plugin = WidgetPlugins.getPlugin('foo');

            assert.isOk(plugin);
            assert.equal('foo', plugin.type);
        });
    });
});
