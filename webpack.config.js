var path = require("path");
var webpack = require("webpack");

var paths = {
    src: path.join(__dirname, "src"),
    css: [
        path.join(__dirname, "node_modules/semantic-ui-css"),
        path.join(__dirname, "node_modules/react-grid-layout")
    ]
};

module.exports = {
    //context: __dirname + "/dist",
    cache: true,
    bail: true,
    entry: {
        app: "./src/app.js",
        vendor: ["react", "react-dom", "redux", "react-redux", "react-grid-layout"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        //publicPath: "/",
        filename: "[name].bundle.js"
    },
    resolve: {
        root: [
            path.resolve('./dist')
        ]
    },
   // resolveLoader: {root: path.join(__dirname, "node_modules")},
    //devtool: 'cheap-eval-source-map',
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel?cacheDirectory',
                include: paths.src
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                include: paths.css
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff",
                include: paths.css
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader",
                include: paths.css
            },
            {
                test: /\.(png)$/, loader: "file-loader",
                include: paths.css
            }
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