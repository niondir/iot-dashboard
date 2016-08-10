/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import 'source-map-support'
import "file?name=[name].[ext]!./tests.html"

const win = (<any>window);

win.sourceMapSupport.install();

/* inject:tests */
import './datasource/datasource.test.ts'
import './datasource/datasourcePluginFactory.test.ts'
import './datasource/datasourcePluginRegistry.test.ts'
import './datasource/datasourcePlugins.test.ts'
import './datasource/datasourceScheduler.test.ts'
import './pluginApi/plugins.test.ts'
import './pluginApi/uri.test.js'
import './serverRenderer.test.ts'
import './util/collection.test.js'
import './widgets/widgetPlugins.test.ts'
import './widgets/widgets.test.ts'
/* endinject */

// In case we run with phantomJS this is needed
// Waiting for https://github.com/webpack/mocha-loader/pull/27
if (typeof window !== 'undefined' && win.initMochaPhantomJS) {
    console.log("calling `window.initMochaPhantomJS()`");
    win.initMochaPhantomJS();
}
else {
    console.log("no window found!");
}
