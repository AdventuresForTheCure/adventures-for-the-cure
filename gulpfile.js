var del = require('del');
var gulp   = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plug = gulpLoadPlugins();

var publicjs = './public/app/**/*.js';
var serverjs = './server/**/*.js';
var publicdist = './public/dist';

gulp.task('clean', function(cb) {
  del(['dist'], cb)
});

gulp.task('jshintserver', function() {
  return gulp.src(serverjs)
    .pipe(plug.jshint('./gulp/.jshintrc'))
    .pipe(plug.jshint.reporter('default'))
});

gulp.task('jshintpublic', function() {
  gulp.src(publicjs)
    .pipe(plug.jshint('./gulp/.jshintrc'))
    .pipe(plug.jshint.reporter('default'))
})

gulp.task('bundlejs', function() {
  return gulp.src(publicjs)
    .pipe(plug.ngAnnotate())
    .pipe(plug.concat('app.js'))
    .pipe(gulp.dest(publicdist))
    .pipe(plug.rename({suffix: '.min'}))
    .pipe(plug.uglify())
    .pipe(gulp.dest(publicdist))
});

//gulp.task('images', function() {
//  return gulp.src('./public/img/**/*')
//    .pipe(plug.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
//    .pipe(gulp.dest('./public/dist/img'))
//});

gulp.task('watch', function() {
  gulp.watch(serverjs, ['jshintserver']).on('change', logWatch);
  gulp.watch(publicjs, ['jshintpublic', 'bundlejs']).on('change', logWatch);

  function logWatch(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }
});

gulp.task('development', ['clean'], function() {
  gulp.start('jshintserver', 'jshintpublic', 'bundlejs', 'watch');
  plug.nodemon({script: 'server.js', ext: 'jade js'})
    .on('restart', function() {
      console.log('restarted');
    })
});

gulp.task('default', ['clean'], function() {
  gulp.start('jshintserver', 'jshintpublic', 'bundlejs');
});
