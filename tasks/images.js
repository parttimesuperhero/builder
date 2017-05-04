// Import Dependancies
const gulp = require('gulp'),
      imagemin = require('gulp-imagemin'),
      imageminJpegRecompress = require('imagemin-jpeg-recompress');


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
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imageminJpegRecompress({
          min: 40,
          max: 60
        }),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({plugins: [{removeViewBox: false}]})
      ]))
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
