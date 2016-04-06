const gulp = require('gulp');
var gutil = require('gulp-util');
const babel = require('gulp-babel');
const webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task("dev", ["webpack"], function() {
    gulp.watch(["src/**/*"], ["webpack"]);
});


gulp.task('compile', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});

var webpackConfig = require('./webpack.config.js');
gulp.task('webpack', function(callback) {
    webpack(webpackConfig, function(error, stats) {
        //if (error) throw new gutil.PluginError('webpack', error);
        gutil.log('[webpack]', stats.toString());

        callback();
    });
});



gulp.task('copy:html', function () {
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task("wpdev", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
        // server and middleware options
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        // callback();
    });
});