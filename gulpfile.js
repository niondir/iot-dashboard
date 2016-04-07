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


gulp.task("dev", ["compile", "browser-sync"], function () {
	gulp.watch(["src/**/*.js"], ["webpack"]);
	gulp.watch(["src/**/*.html"], ["copy:html"]);
	gulp.watch("./dist/**/*.*", browserSync.reload);

	gulp.watch("package.json", ["compile"]);
});


////////////////////

gulp.task('compile', ['webpack', 'copy:all'], () => {
});

var webpackConfig = require('./webpack.config.js');
gulp.task('webpack', function (callback) {
	webpack(webpackConfig, function (error, stats) {
		//if (error) throw new gutil.PluginError('webpack', error);
		gutil.log('[webpack]', stats.toString());

		callback();
	});
});

///////////////
// Copy Tasks
///////////////

gulp.task('copy:all', ['copy:html']);

gulp.task('copy:html', function () {
	gulp.src('./src/**/*.html')
		.pipe(gulp.dest('./dist'));
});


var WebpackDevServer = require("webpack-dev-server");
gulp.task("webpack:server", function (callback) {
	// Start a webpack-dev-server
	var compiler = webpack(webpackConfig);

	new WebpackDevServer(compiler, {
		// server and middleware options
	}).listen(8080, "localhost", function (err) {
		if (err) throw new gutil.PluginError("webpack-dev-server", err);
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