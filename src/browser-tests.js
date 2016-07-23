/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */


import "file?name=[name].[ext]!./tests.html"

/* inject:tests */
import './datasource/datasourcePlugins.test.ts'
import './datasource/plugins/randomDatasource.test.js'
import './pluginApi/uri.test.js'
import './serverRenderer.test.ts'
import './util/collection.test.js'
import './widgets/widgetPlugins.test.js'
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
