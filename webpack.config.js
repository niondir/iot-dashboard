var path = require("path");
var webpack = require("webpack");

module.exports = {
    //context: __dirname + "/src",
    cache: true,
    entry: {
        app: "./src",
        vendor: ["react", "react-dom", "redux", "react-redux"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "dist/",
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel?cacheDirectory',
                include: path.join(__dirname, "src")
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ]
};