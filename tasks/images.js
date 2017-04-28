// Import Dependancies
const gulp = require('gulp'),
      imagemin = require('gulp-imagemin');


/***************************************************
 *  Image Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const config = {
    'src': './src/assets/images/*.*',
    'dest': './dist/images'
  };

  gulp.task('images', ['clean:images'], () => {
    gulp.src(config.src)
      .pipe(imagemin())
      .pipe(gulp.dest(config.dest))
  });

  gulp.task('images:watch', ['images'], () => {
    gulp.watch(config.src, ['images']);
  });

  // Clean the built directory
  gulp.task('clean:images', () => {
  return gulp.src(config.dest, { read: false }) // much faster
    .pipe(rimraf());
  });
};
