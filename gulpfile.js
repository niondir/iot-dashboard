const gulp = require('gulp');
var gutil = require('gulp-util');

////////////////////
// Main Tasks
////////////////////

/**
 * Setup everything for a smooth development
 */
gulp.task("dev", ['inject', 'copy', 'webpack:server']);


/**
 * Keeps files up to date that are not covered by Webpack
 */
gulp.task('watch', ["inject:tests", "copy:plugins"], function() {
    gulp.watch("src/**/*.test.js", ["inject:tests"]);
    gulp.watch("plugins/**/*", ["copy:plugins"]);
});


/**
 * Build everything required for a successful CI build
 * */
gulp.task("build", ['compile', 'test', 'lint']);


/**
 * Compile all code to /dist
 * - no tests, no overhead, just what is needed to generate a runnable application
 * */
gulp.task('compile', ['copy:plugins', 'webpack:client']);


//////////////////
// Testing Tasks
//////////////////

var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('test', ['mocha']);

gulp.task('mocha', ['mocha:client', 'mocha:server']);


gulp.task('mocha:server', ['webpack:servertests'], function () {
    return gulp.src('dist/servertests.bundle.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'})); // more details with 'spec', more fun with 'nyan'
});


gulp.task('mocha:client', ['inject:tests', 'webpack:tests'], function () {
    return gulp
        .src('dist/tests.html')
        .pipe(mochaPhantomJS({reporter: 'spec', dump: 'test.log'}));
});

//////////////////
// Lint Tasks
// ///////////////
const eslint = require('gulp-eslint');

gulp.task('lint', function () {
    return gulp.src(['src/**/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

//////////////////
// Compile Tasks
//////////////////
const babel = require('gulp-babel');
const webpack = require('webpack');

const webpackErrorHandler = function (callback, error, stats) {
    if (error) throw new gutil.PluginError('webpack', error);
    gutil.log('[webpack]', stats.toString());

    callback();
};

gulp.task('webpack', ['webpack:client', 'webpack:tests', 'webpack:servertests'], function (callback) {
});


gulp.task('webpack:client', [], function (callback) {
    var webpackConfig = require('./webpack.config.js');

    webpack(webpackConfig, webpackErrorHandler.bind(this, callback));
});

gulp.task('webpack:tests', ['inject'], function (callback) {
    var webpackConfig = require('./webpack.tests.js');

    webpack(webpackConfig, webpackErrorHandler.bind(this, callback));
});

gulp.task('webpack:servertests', [], function (callback) {
    var webpackConfig = require('./webpack.servertests.js');

    webpack(webpackConfig, webpackErrorHandler.bind(this, callback));
});

/////////////////
// Inject Tasks
/////////////////
var inject = require('gulp-inject');

gulp.task('inject', ['inject:tests']);

gulp.task('inject:tests', function () {
    var target = gulp.src('./src/tests.js');
    // It's not necessary to read the files (will speed up things), we're only after their paths: 
    var sources = gulp.src(['./src/**/*.test.js'], {read: false});

    return target.pipe(inject(sources, {
            relative: true,
            starttag: '/* inject:tests */',
            endtag: '/* endinject */',
            transform: function (filepath, file, i, length) {
                return "import './" + filepath + "'";
            }
        }))
        .pipe(gulp.dest('./src'));
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

gulp.task('copy', ['copy:plugins']);

gulp.task('copy:plugins', function () {
    gulp.src('./plugins/**/*.*')
        .pipe(gulp.dest('./dist/plugins'));
});


//////////////////////
// Webpack Dev-Server
//////////////////////

var WebpackDevServer = require("webpack-dev-server");
gulp.task("webpack:server", ['copy', 'inject'], function (callback) {
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