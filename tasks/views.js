// Import Dependancies
const gulp = require('gulp'),
      pug = require('gulp-pug'),
      rimraf = require('gulp-rimraf'),
      pugData = require('gulp-data'),
      path = require('path');

/***************************************************
 *  Views Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const config = {
    'src': './src/views/**/*.pug',
    'dest': './dist/',
    'demoSrc': './src/demo/**/*.pug',
    'demoDest': './demo/',
  };

  gulp.task('views:watch', ['views', 'views:demo'], () => {
    gulp.watch(config.src, ['views']);
    gulp.watch(config.demoSrc, ['views:demo']);
  });

  gulp.task('views', ['clean:views'], () => {
    return gulp.src(config.src)
      .pipe(pugData(function(file) {
        return require(file.path.replace('/src/views', '/src/data').replace('.pug', '.json') )
      }))
      .pipe(pug())
      .pipe(gulp.dest(config.dest))
  });

  gulp.task('views:demo', ['clean:demo:views'], () => {
    return gulp.src(config.demoSrc)
      .pipe(pug())
      .pipe(gulp.dest(config.demoDest))
  });

  // Clean the built directory
  gulp.task('clean:views', () => {
  return gulp.src(config.dest + '*.html', { read: false }) // much faster
    .pipe(rimraf());
  });

  gulp.task('clean:demo:views', () => {
  return gulp.src(config.demoDest + '*.html', { read: false }) // much faster
    .pipe(rimraf());
  });
};
