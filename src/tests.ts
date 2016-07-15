
/* inject:tests */
import './datasource/datasourcePlugins.test.js'
import './pluginApi/uri.test.js'
import './util/collection.test.js'
import './widgets/widgetPlugins.test.js'
import './datasource/plugins/randomDatasource.test.js'
import './serverRenderer.test.ts'
/* endinject */

// TODO: instead of inject we could use require.context
// var testsContext = require.context(".", true, /_test$/);
// testsContext.keys().forEach(testsContext);
