var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackConfig = require('./webpack.config.js');

webpackConfig.entry = {
    tests: ['mocha!./src/tests.js']
};

webpackConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("[name].bundle.css"),
    new webpack.ProvidePlugin({
        $: "jquery",
        "_": "lodash",
        "React": "react"
    })

];

module.exports = webpackConfig;
