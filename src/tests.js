
import "file?name=[name].[ext]!./tests.html"

/* inject:tests */
import './datasource/datasourcePlugins.test.js'
import './pluginApi/uri.test.js'
import './util/collection.test.js'
import './widgets/widgetPlugins.test.js'
import './datasource/plugins/randomDatasource.test.js'
/* endinject */

// In case we run with phantomJS this is needed
// Waiting for https://github.com/webpack/mocha-loader/pull/27
if (typeof window !== 'undefined' && window.initMochaPhantomJS) {
    console.log("calling `window.initMochaPhantomJS()`");
    window.initMochaPhantomJS();
}
else {
    console.log("no window found!");
}

var assert = require('chai').assert;
describe('Example Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});

