var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// TODO: Performance, Use Dll Bundle
// https://webpack.github.io/docs/build-performance.html

var paths = {
    src: path.join(__dirname, "src"),
    vendor: path.join(__dirname, "vendor"),
    node_modules: path.join(__dirname, "node_modules"),
    css: [
        path.join(__dirname, "node_modules/semantic-ui-css"),
        path.join(__dirname, "node_modules/react-grid-layout")
    ]
};

var packageJson = require("./package.json");

var minify = true;
var dotJs = minify ? ".js" : ".min.js";
var dotCss = minify ? ".css" : ".min.css";

module.exports = {
    //context: __dirname + "/dist",
    cache: true,
    bail: true, // Fail fast
    //devtool: '#cheap-module-source-map',
    devtool: 'eval-cheap-module-source-map',
    entry: {
        app: ["./src/app.js"],
        tests: ['mocha!./src/tests.js'],
        vendor: [
            "react", "react-dom", "react-grid-layout", "react-grid-layout/css/styles.css",
            "redux", "react-redux", "redux-logger", "redux-thunk", "redux-form",
            "semantic-ui-css/semantic", "semantic-ui-css/semantic.css", "jquery", "c3css", "c3", "d3",
            "form-serialize", "lodash", "scriptjs"
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        //publicPath: "/",
        filename: "[name].bundle.js",
        chunkFilename: "chunk.[id].js"
    },
    resolve: {
        extensions: ["", ".js"],
        root: [
            path.resolve('./dist')
        ],
        alias: {
            jquery: path.resolve('./node_modules/jquery/dist/jquery' + dotJs),
            lodash: path.resolve('./node_modules/lodash'),
            d3: path.resolve('./vendor/d3/d3' + dotJs),
            c3: path.resolve('./vendor/c3/c3' + dotJs),
            c3css: path.resolve('./vendor/c3/c3' + dotCss),
            'react-redux': path.resolve('./node_modules/react-redux/dist/react-redux' + dotJs),
            'redux-form': path.resolve('./node_modules/redux-form/dist/redux-form' + dotJs),

            // Locading chai.js will fail with webpack because the require is processed
            //'chai': path.resolve('./node_modules/chai/chai.js')
        }
    },
    // resolveLoader: {root: path.join(__dirname, "node_modules")},
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel?cacheDirectory',
                include: paths.src
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            /*{
             test: /\.css$/,
             loader: "style-loader!css-loader",
             include: paths.css
             },*/
            /*{
             test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
             loader: "url-loader?limit=1&mimetype=application/font-woff",
             include: paths.css
             },*/
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=fonts/[name].[sha256:hash:base58:10].[ext]",
                include: paths.css
            },
            {
                test: /\.(png)$/,
                loader: "file-loader?name=img/[name].[sha256:hash:base58:10].[ext]",
                include: paths.css
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin( {names:["vendor"],  filename:"vendor.bundle.js", chunks: ["app", "tests"]}),
        new ExtractTextPlugin("[name].bundle.css"),
        new webpack.PrefetchPlugin('./src/pageLayout.js'),
        new webpack.PrefetchPlugin(paths.node_modules, 'semantic-ui-css/semantic.css'),
        new webpack.PrefetchPlugin(paths.node_modules, 'react/lib/ReactDOM.js'),
        new webpack.PrefetchPlugin(paths.node_modules, 'react-grid-layout/build/ReactGridLayout.js'),
        new webpack.PrefetchPlugin(paths.node_modules, 'react/lib/DOMChildrenOperations.js'),
        new webpack.PrefetchPlugin(paths.node_modules, 'chai/index.js'),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "_": "lodash"
        })

    ]
};