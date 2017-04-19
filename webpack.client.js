var webpack = require("webpack");

var webpackConfig = require('./webpack.config.js');
var PROD = (process.env.NODE_ENV === 'production');

webpackConfig.entry = {
    app: ["./src/app.ts"],
    "browser-tests": ['mocha!./src/browser-tests.ts'],
    vendor: [
        "react", "react-dom", "react-grid-layout", "react-grid-layout/css/styles.css",
        "redux", "react-redux", "redux-logger", "redux-thunk", "redux-form",
        "semantic-ui-css/semantic", "semantic-ui-css/semantic.css", "jquery", "c3css", "c3", "d3",
        "form-serialize", "lodash", "loadjs", "urijs", "es6-promise"
    ]
};

webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({names: ["vendor"], filename: "vendor.bundle.js", minChunks: Infinity, chunks: ["app", "vendor"]}),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'semantic-ui-css/semantic.css'),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'react-grid-layout/build/ReactGridLayout.js')

    // Size Optimization
    //new webpack.optimize.OccurrenceOrderPlugin()
    //new webpack.optimize.DedupePlugin(),
);

if (PROD) {
    // TODO: this takes ages, we start with just using minified dependencies in prod.
    //webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, include: webpackConfig.paths.src}));

} else {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = webpackConfig;
