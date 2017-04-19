var path = require("path");
var webpack = require("webpack");

var webpackConfig = require('./webpack.config.js');

webpackConfig.entry = {
	/**
     * Compiles all tests in a single bundle to be easily executed with mocha
     */
    tests: ['./src/tests.ts']
};

webpackConfig.devtool = undefined;

//webpackConfig.resolve.alias['source-map-support'] = path.resolve('./node_modules/source-map-support/source-map-support.js');
delete webpackConfig.resolve.alias['source-map-support'];

webpackConfig.module.postLoaders.unshift(
    /*{ // Used for remap-istanbul to find all sourcemaps of external dependencies
     test: /\.(js)$/,
     loader: "source-map-loader"
     }, */
    {
        // does not include .test. but has valid ending
        test: /^((?!\.test\.).)*\.(ts|js|tsx|jsx)$/,
        // With embedSource=false, we could get original ts files in the reports ... but the reporter does not work :(
        loader: "istanbul-instrumenter?embedSource=true",
        include: webpackConfig.paths.src
    }
);

module.exports = webpackConfig;
