var path = require("path");
var webpack = require("webpack");

module.exports = {
    //context: __dirname + "/dist",
    cache: true,
    entry: {
        app: "./src/app.js",
        vendor: ["react", "react-dom", "redux", "react-redux", "gridster"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].bundle.js"
    },
    resolve: {
        root: [
            path.resolve('./dist')
        ]
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel?cacheDirectory',
                include: path.join(__dirname, "src")
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
            {test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"},
            {test: /\.(png)$/, loader: "file-loader"}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })

    ]
};