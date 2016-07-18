var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackConfig = require('./webpack.config.js');

webpackConfig.entry = {
    "browser-tests": ['mocha!./src/browser-tests.js']
};

webpackConfig.plugins = [
    new ExtractTextPlugin("[name].bundle.css"),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "_": "lodash",
        "React": "react"
    })

];

module.exports = webpackConfig;
