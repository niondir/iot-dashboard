const gulp = require('gulp');
var gutil = require('gulp-util');

////////////////////
// Main Tasks
////////////////////

/**
 * Setup everything for a smooth development
 * TODO: watch sometimes does not work in parallel to webpack dev server
 */
gulp.task("dev", ['webpack:server', 'watch']);


/**
 * Keeps files up to date that are not covered by Webpack
 */
gulp.task('watch', ["copy:html", "inject:tests", "copy:plugins"], () => {
    gulp.watch("src/**/*.html", ["copy:html"]);
    gulp.watch("src/**/*.test.js", ["inject:tests"]);
    gulp.watch("plugins/**/*", ["copy:plugins"]);
});


/** 
 * Build everything required for a successful deployment
 * */
gulp.task("build", ['compile', 'test', 'lint']);

gulp.task('compile', ['webpack', 'copy']);

gulp.task('test',['mocha']);

////////////////////

//////////////////
// Testing Tasks
//////////////////

var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('mocha', ['mocha:phantomJs'], function () {
});

// Deprectaed: TODO: Remove
gulp.task('mocha:nodejs', ['webpack', 'inject:tests'], function () {
    return gulp.src('dist/mocha.bundle.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'})); // more details with 'spec', more fun with 'nyan'
});


gulp.task('mocha:phantomJs', ['webpack', 'inject:tests'], function () {
    return gulp
        .src('dist/tests.html')
        .pipe(mochaPhantomJS({reporter: 'spec', dump:'test.log'}));
});

//////////////////
// Lint Tasks
// ///////////////
const eslint = require('gulp-eslint')

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
// ///////////////
const babel = require('gulp-babel');
const webpack = require('webpack');

gulp.task('webpack', ['inject'], function (callback) {
    var webpackConfig = require('./webpack.config.js');

    webpack(webpackConfig, function (error, stats) {
        if (error) throw new gutil.PluginError('webpack', error);
        gutil.log('[webpack]', stats.toString());

        callback();
    });
});

///////////////
// Inject Tasks
///////////////
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

gulp.task('copy', ['copy:html', 'copy:css', 'copy:plugins']);

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

gulp.task('copy:plugins', function () {
    gulp.src('./plugins/**/*.*')
        .pipe(gulp.dest('./dist/plugins'));
});


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