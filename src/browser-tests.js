
import "file?name=[name].[ext]!./tests.html"

/* inject:tests */
import './datasource/datasourcePlugins.test.js'
import './pluginApi/uri.test.js'
import './widgets/widgetPlugins.test.js'
import './util/collection.test.js'
import './datasource/plugins/randomDatasource.test.js'
import './serverRenderer.test.ts'
import './widgets/widgets.test.ts'
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
