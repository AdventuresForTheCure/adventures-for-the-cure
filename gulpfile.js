'use strict';

var gulp   = require('gulp');
var runSequence = require('run-sequence');
var gulpLoadPlugins = require('gulp-load-plugins');
var plug = gulpLoadPlugins();

var publicjs = './public/app/**/*.js';
var serverjs = './server/**/*.js';
var publictestjs = './test/public/*.js';
var servertestjs = './test/server/*.js';
var publicdist = './public/dist';

gulp.task('public-clean', function() {
  return gulp.src(publicdist, {read: false})
    .pipe(plug.clean());
});

gulp.task('public-jshint', function() {
  gulp.src(publicjs)
    .pipe(plug.jshint('./gulp/.jshintrc'))
    .pipe(plug.jshint.reporter('default'));
});

gulp.task('public-bundlejs', function() {
  return gulp.src(publicjs)
//    .pipe(plug.ngAnnotate())
    .pipe(plug.concat('app.js'))
    .pipe(gulp.dest(publicdist));
//    .pipe(plug.rename({suffix: '.min'}))
//    .pipe(plug.uglify())
//    .pipe(gulp.dest(publicdist));
});

gulp.task('public-test', function() {
  return gulp.src(publictestjs, {read: false})
    .pipe(plug.mocha({reporter: 'spec'}));
});

gulp.task('public-all', ['public-clean'], function(callback) {
  runSequence('public-jshint', 'public-bundlejs', callback);
});

gulp.task('server-jshint', function() {
  return gulp.src(serverjs)
    .pipe(plug.jshint('./gulp/.jshintrc'))
    .pipe(plug.jshint.reporter('default'));
});

gulp.task('server-test', function() {
  return gulp.src(servertestjs, {read: false})
    .pipe(plug.mocha({reporter: 'spec'}));
});

gulp.task('server-all', function(callback) {
  runSequence('server-jshint', 'server-test', callback);
});

gulp.task('watch-all', function() {
  gulp.watch([serverjs, servertestjs], ['server-all']).on('change', logWatch);
  gulp.watch([publicjs, publictestjs], ['public-all']).on('change', logWatch);

  function logWatch(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }
});

gulp.task('nodemon', function() {
  plug.nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['public/dist/*.js', 'public/app/**/*', 'public/app/app.js', './test/**/*', 'gulpfile.js'],
    nodeArgs: ['--debug']
  })
  .on('restart', function(files) {
    console.log('restarted due to change in ' + files);
  })
});

gulp.task('development', function(callback) {
  runSequence('public-all', 'server-all', ['watch-all', 'nodemon'], callback);
});

gulp.task('default', function(callback) {
  runSequence('public-all', 'server-all', callback);
});