/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const gulp = require('gulp');
const gutil = require('gulp-util');
const sequence = require('gulp-sequence');
const open = require('open');

////////////////////
// Main Tasks
////////////////////

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = gutil.env.production ? 'production' : 'development';
}

/**
 * Needed to end the build when mocha tests are done.
 * The issue came when I used promises in mocha test the first time.
 */
gulp.doneCallback = function (err) {
    process.exit(err ? 1 : 0);
};

gutil.log("NODE_ENV = '" + process.env.NODE_ENV + "'");

/**
 * Setup everything for a smooth development
 */
gulp.task("dev", sequence(['inject', 'copy'], 'webpack:dev-server'));

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
 * TODO: Due to webpack foo we need to build tests first and than compile the client! (try webpack-stream?)
 * see: https://github.com/webpack/webpack/issues/2787
 * */
gulp.task("build", sequence('test', ['compile', 'lint']));


/**
 * Compile all code to /dist
 * - no tests, no overhead, just what is needed to generate a runnable application
 * */
gulp.task('compile', sequence('copy:plugins', 'webpack:client'));

// TODO: We do not have uiTests yet. All tests are running with node
// There is some ui test code already but it's considered unstable (should we just delete it for now?)
gulp.task('test', ['mocha']);

//////////////////
// Environment
//////////////////

gulp.task('set-dev-node-env', function () {
    return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function () {
    return process.env.NODE_ENV = 'production';
});

//////////////////
// Testing Tasks
//////////////////

var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('mocha', ['mocha:tests']);


gulp.task('mocha:tests', ['webpack:tests'], function () {
    return gulp.src('dist/tests.bundle.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'})) // more details with 'spec', more fun with 'nyan'
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


/*
 gulp.task('mocha:ui-tests', ['inject:tests', 'webpack:ui-tests'], function () {
 return gulp
 .src('dist/ui-tests.html')
 .pipe(mochaPhantomJS({reporter: 'spec', dump: 'ui-tests.log'}));
 });*/

//////////////////
// Lint Tasks
// ///////////////
const eslint = require('gulp-eslint');
const tslint = require("gulp-tslint");

// TODO: Add tslint for typescript
gulp.task('lint', ['eslint', 'tslint']);

gulp.task('eslint', function () {
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

gulp.task("tslint", () =>
    gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: "prose" // prose or verbose
        }))
        .pipe(tslint.report({
            emitError: true,
            summarizeFailureOutput: true
        }))
);

//////////////////
// Compile Tasks
//////////////////
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
    if (error) {
        //gutil.log("------------------------------------------------");
        //gutil.log("error: ", error);
        //throw new Error("Failed");
        throw new gutil.PluginError('webpack', error);
    }
    gutil.log('[webpack]', stats.toString());

    callback();
};

gulp.task('webpack', sequence('webpack:tests', 'webpack:client'));

gulp.task('webpack:client', ['compile:config'], function (callback) {
    var webpackConfig = require('./webpack.client.js');
    webpack(webpackConfig, webpackErrorHandler.bind(this, callback));
});

gulp.task('webpack:tests', ['inject:tests', 'compile:config'], function (callback) {
    var webpackConfig = require('./webpack.tests.js');
    webpack(webpackConfig, webpackErrorHandler.bind(this, callback));
});

gulp.task('webpack:browser-tests', ['inject:tests', 'compile:config'], function (callback) {
    var webpackConfig = require('./webpack.browser-tests.js');
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
var sort = require('gulp-sort');

gulp.task('inject', ['inject:tests']);

gulp.task('inject:tests', function () {
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./src/**/*.test.js', './src/**/*.test.ts'], {read: false})
        .pipe(sort());

    return gulp.src(['./src/tests.ts', './src/browser-tests.ts'])
        .pipe(inject(sources, {
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
gulp.task("webpack:dev-server", ['copy', 'inject', 'compile:ts'], function (callback) {
    // Start a webpack-dev-server
    var webpackConfig = require('./webpack.client.js');
    webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
    webpackConfig.entry["browser-tests"].unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
    webpackConfig.bail = false;
    webpackConfig.devtool = '#cheap-module-source-map';
    var compiler = webpack(webpackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);

        if (!gutil.env['no-browser']) {
            open("http://localhost:8080");
            open("http://localhost:8080/webpack-dev-server/tests.html");
        }
    });

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