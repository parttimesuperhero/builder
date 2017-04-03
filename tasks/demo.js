// Import Dependancies
const gulp = require('gulp'),
      pug = require('gulp-pug'),
      rimraf = require('gulp-rimraf');

/***************************************************
 *  Views Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const config = {
    'src': './demo/**/*.pug',
    'dest': './'
  };

  gulp.task('views:watch', ['views'], () => {
    gulp.watch(config.src, ['views']);
  });

  gulp.task('views', ['clean:views'], () => {
    return gulp.src(config.src)
      .pipe(pug())
      .pipe(gulp.dest(config.dest))
  });

  // Clean the built directory
  gulp.task('clean:views', () => {
  return gulp.src(config.dest + '*.html', { read: false }) // much faster
    .pipe(rimraf());
  });
};
