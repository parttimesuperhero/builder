// Import Dependancies
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      cleanCSS = require('gulp-clean-css'),
      sassLint = require('gulp-sass-lint'),
      importer = require('sass-module-importer'),
      autoprefixer = require('gulp-autoprefixer');

/***************************************************
 *  Styles Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const config = {
    'src': './src/scss/**/*.s+(a|c)ss',
    'dest': './dist/css',
    'demoSrc': './src/demo/*.s+(a|c)ss',
    'demoDest': './demo/'
  };

  gulp.task('styles', ['clean:styles'], () => {
    return gulp.src(config.src)
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
      .pipe(sass({
        importer: importer()
      }))
      .pipe(cleanCSS({
        compatibility: 'ie9',
          level: {
            2: {
              all: false, // sets all values to `false`
              removeDuplicateRules: true // turns on removing duplicate rules
            }
          }
      }))
      .pipe(gulp.dest(config.dest))
  });

  gulp.task('styles:demo', ['clean:demo:styles'], () => {
    return gulp.src(config.demoSrc)
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
      .pipe(sass({
        include: ['./node_modules/../']
      }))
      .pipe(autoprefixer({
        browsers: ['>1%', 'last 2 versions']
      }))
      .pipe(cleanCSS({
        compatibility: 'ie9',
          level: {
            2: {
              all: false, // sets all values to `false`
              removeDuplicateRules: true // turns on removing duplicate rules
            }
          }
      }))
      .pipe(gulp.dest(config.demoDest))
  });

  gulp.task('styles:watch', ['styles', 'styles:demo'], () => {
     gulp.watch(config.src, ['styles']);
     gulp.watch(config.demoSrc, ['styles:demo']);
  });

  // Clean the built directory
  gulp.task('clean:styles', () => {
  return gulp.src(config.dest, { read: false }) // much faster
    .pipe(rimraf());
  });

  gulp.task('clean:demo:styles', () => {
  return gulp.src(config.demoDest + '*.css', { read: false }) // much faster
    .pipe(rimraf());
  });
};
