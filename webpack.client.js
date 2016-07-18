var webpack = require("webpack");

var webpackConfig = require('./webpack.config.js');

webpackConfig.entry = {
    app: ["./src/app.ts"],
    vendor: [
        "react", "react-dom", "react-grid-layout", "react-grid-layout/css/styles.css",
        "redux", "react-redux", "redux-logger", "redux-thunk", "redux-form",
        "semantic-ui-css/semantic", "semantic-ui-css/semantic.css", "jquery", "c3css", "c3", "d3",
        "form-serialize", "lodash", "loadjs", "urijs"
    ]
};

webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({names: ["vendor"], filename: "vendor.bundle.js", chunks: ["app"]}),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'semantic-ui-css/semantic.css'),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'react/lib/ReactDOM.js'),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'react-grid-layout/build/ReactGridLayout.js'),
    new webpack.PrefetchPlugin(webpackConfig.paths.node_modules, 'react/lib/DOMChildrenOperations.js')
);

module.exports = webpackConfig;
