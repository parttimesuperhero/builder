// Import Dependancies
const gulp = require('gulp'),
      imagemin = require('gulp-imagemin'),
      imageminJpegRecompress = require('imagemin-jpeg-recompress');


/***************************************************
 *  Image Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const config = {
    'src': [ './src/assets/images/**', '!./src/assets/images/backgrounds/**' ],
    'bgImages': './src/assets/images/backgrounds/**',
    'dest': './dist/images'
  };

  gulp.task('images', ['clean:images'], () => {
    return gulp.src(config.src)
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imageminJpegRecompress({
          min: 40,
          max: 75
        }),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({plugins: [{removeViewBox: false}]})
      ]))
      .pipe(gulp.dest(config.dest))
  });

  gulp.task('backgroundImages', ['images'], () => {
    return gulp.src(config.bgImages)
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imageminJpegRecompress({
          min: 30,
          max: 38
        }),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({plugins: [{removeViewBox: false}]})
      ]))
      .pipe(gulp.dest(config.dest))
  });


  gulp.task('images:watch', ['images', 'backgroundImages'], () => {
    gulp.watch(config.src, ['images']);
    gulp.watch(config.bgImages, ['backgroundImages']);
  });

  // Clean the built directory
  gulp.task('clean:images', () => {
  return gulp.src(config.dest, { read: false }) // much faster
    .pipe(rimraf());
  });
};
