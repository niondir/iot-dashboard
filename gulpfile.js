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
gulp.task('watch', ["inject:tests", "copy"], function () {
    gulp.watch("src/**/*.test.js", ['inject:tests']);
    gulp.watch("src/**/*.test.ts", ['inject:tests']);
    gulp.watch("plugins/**/*", ['copy:plugins']);
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

// TODO: We do not have uiTests yet. All tests are running with node
// There is some ui test code already but it's considered unstable (should we just delete it for now?)
gulp.task('test', ['mocha']);

//////////////////
// Testing Tasks
//////////////////

var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var istanbulReport = require('gulp-istanbul-report');

gulp.task('mocha', ['mocha:tests']);

/** Remap coverage report based on sourcemaps - does not work yet
 * TODO: Remove this task + dependencies when we have coverage reports on TS files correctly mapped
 * **/
gulp.task('remap', function () {
    return gulp.src('./coverage/coverage-final.json')
        .pipe(remapIstanbul({
            fail: false
        }))
        .pipe(istanbulReport({
            reporters: [
                'text-summary',
                {name: 'lcov', dir: 'coverage/remapped'}
                //{name: 'html', dir: 'coverage/html/'}
                //{name: 'text', dir: 'coverage/report.txt'},
            ]
        }));
});

gulp.task('report', function () {
    return gulp.src('./coverage/coverage-final.json')
        .pipe(istanbulReport({
            reporters: [
                'text-summary',
                //{name: 'lcov', dir: 'coverage'}
                //{name: 'html', dir: 'coverage/html/'}
                {name: 'text', dir: 'coverage/report.txt'},
            ]
        }));
});


gulp.task('mocha:tests', ['webpack:tests'], function () {
    return gulp.src('dist/tests.bundle.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec', dump: 'tests.log'})) // more details with 'spec', more fun with 'nyan'
        .pipe(istanbul.writeReports({
            coverageVariable: '__coverage__',
            reporters: ['json', 'text-summary', 'lcovonly']
        })).pipe(istanbul.writeReports({
            coverageVariable: '__coverage__',
            reporters: ['html'],
            reportOpts: {
                html: {dir: 'dist/coverage'}
            }
        }));
});


gulp.task('mocha:ui-tests', ['inject:tests', 'webpack:ui-tests'], function () {
    return gulp
        .src('dist/uiTests.html')
        .pipe(mochaPhantomJS({reporter: 'spec', dump: 'ui-tests.log'}));
});

//////////////////
// Lint Tasks
// ///////////////
const eslint = require('gulp-eslint');

// TODO: Add tslint for typescript
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
const ts = require('gulp-typescript');

var tsProject = ts.createProject('./tsconfig.json');

/**
 * It's not yet intended to compile the TS code without webpack.
 * But if someone wants to use parts of the code as library this might get handy.
 */
gulp.task('compile:ts', [], function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('./lib'));
});

const webpackErrorHandler = function (callback, error, stats) {
    if (error) throw new gutil.PluginError('webpack', error);
    gutil.log('[webpack]', stats.toString());

    callback();
};

gulp.task('webpack', ['webpack:client', 'webpack:tests', 'webpack:servertests'], function (callback) {
});


gulp.task('webpack:client', ['compile:config'], function (callback) {
    var webpackConfig = require('./webpack.config.js');

    webpack(webpackConfig, webpackErrorHandler.bind(this, callback));
});

gulp.task('webpack:tests', ['inject', 'compile:config'], function (callback) {
    var webpackConfig = require('./webpack.tests.js');

    webpack(webpackConfig, webpackErrorHandler.bind(this, callback));
});

gulp.task('webpack:ui-tests', ['compile:config'], function (callback) {
    var webpackConfig = require('./webpack.ui-tests.js');

    webpack(webpackConfig, webpackErrorHandler.bind(this, callback));
});

var jeditor = require("gulp-json-editor");
var git = require('git-rev-sync');
var packageJson = require('./package.json');

gulp.task('compile:config', function () {
    return gulp.src("./src/config.json")
        .pipe(jeditor(function (json) {
            json.version = packageJson.version;
            json.revision = git.long();
            json.revisionShort = git.short();
            json.branch = git.branch();
            return json;
        }))
        .pipe(gulp.dest("./src"));
});

//////////////////////////////
// Inject/Modify files Tasks
//////////////////////////////
var inject = require('gulp-inject');

gulp.task('inject', ['inject:tests']);

gulp.task('inject:tests', function () {
    var target = gulp.src(['./src/tests.ts', './src/uiTests.js']);
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./src/**/*.test.js', './src/**/*.test.ts'], {read: false});

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

gulp.task('clean', ['clean:dist', 'clean:lib']);

gulp.task('clean:dist', function () {
    return del([
        'dist/**/*'
    ]);
});
gulp.task('clean:lib', function () {
    return del([
        'lib/**/*'
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
gulp.task("webpack:server", ['copy', 'inject', 'compile:ts'], function (callback) {
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