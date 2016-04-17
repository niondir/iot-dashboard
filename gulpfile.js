const gulp = require('gulp');
var gutil = require('gulp-util');
const babel = require('gulp-babel');
const webpack = require('webpack');

var browserSync = require('browser-sync').create();

////////////////////
// Main Tasks
////////////////////

/*
 Setup everything for a smooth development
 */


gulp.task("dev", ["webpack:server", 'copy:all'/*, "browser-sync"*/], function () {
    //gulp.watch(["src/**/*.js"], ["webpack"]);
    gulp.watch(["src/**/*.html"], ["copy:html"]);
    //gulp.watch("./dist/**/*.*", browserSync.reload);

    //gulp.watch("package.json", ["compile"]);
    //gulp.watch("webpack.config.js", ["webpack"]);
});


gulp.task('compile', ['webpack', 'copy:all'], () => {
});

////////////////////


gulp.task('webpack', function (callback) {
    var webpackConfig = require('./webpack.config.js');

    webpack(webpackConfig, function (error, stats) {
        if (error) throw new gutil.PluginError('webpack', error);
        gutil.log('[webpack]', stats.toString());

        callback();
    });
});


///////////////
// Clean Tasks
///////////////
var del = require('del');

gulp.task('clean', ['clean:dist']);

gulp.task('clean:dist', function () {
    return del([
        'dist/**/*'
    ]);
});
///////////////
// Copy Tasks
///////////////

gulp.task('copy:all', ['copy:html', 'copy:css']);

gulp.task('copy:html', function () {
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'));
});
gulp.task('copy:css', function () {
    gulp.src('./css/**/*.css')
        .pipe(gulp.dest('./dist'));
});
gulp.task('copy:vendor', function () {
    gulp.src('./vendor/**/*.*')
        .pipe(gulp.dest('./dist/vendor'));
});


var WebpackDevServer = require("webpack-dev-server");
gulp.task("webpack:server", function (callback) {
    // Start a webpack-dev-server
    var webpackConfig = require('./webpack.config.js');
    webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
    webpackConfig.bail = false;
    webpackConfig.devtool = '#cheap-module-source-map';
    var compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
        // server and middleware options
        contentBase: './dist',
        publicPath: "/",
        hot: true
    }).listen(8080, "localhost", function (err) {
        //if (err) throw new gutil.PluginError("webpack-dev-server", err);
        if (err) console.error(err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        // callback();
    });
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});