// Import Dependancies
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      cleanCSS = require('gulp-clean-css'),
      sassLint = require('gulp-sass-lint'),
      autoprefixer = require('gulp-autoprefixer');

/***************************************************
 *  Styles Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const config = {
    'src': './src/scss/*.s+(a|c)ss',
    'dest': './dist/css'
  };

  gulp.task('styles', ['clean:styles'], () => {
    return gulp.src(config.src)
      .pipe(sassLint({
        configFile: './.sass-lint.yml'
      }))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
      .pipe(sass({
        include: ['./node_modules/../']
      }))
      .pipe(autoprefixer({
        browsers: ['>1%', 'last 2 versions']
      }))
      .pipe(cleanCSS({compatibility: 'ie9'}))
      .pipe(gulp.dest(config.dest))
  });

  gulp.task('styles:watch', ['styles'], () => {
     gulp.watch(config.src, ['styles']);
  });

  // Clean the built directory
  gulp.task('clean:styles', () => {
  return gulp.src(config.dest, { read: false }) // much faster
    .pipe(rimraf());
  });
};
