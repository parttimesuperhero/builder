// Import Dependancies
const gulp = require('gulp'),
      es   = require("event-stream")
      rimraf = require('gulp-rimraf'),
      transform = require("vinyl-transform"),
      source = require("vinyl-source-stream"),
      rename     = require('gulp-rename'),
      browserify = require("browserify");

/***************************************************
 *  Javascript Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const config = {
    'src': './src/js/*.js',
    'dest': './dist/js',
    'demoSrc': './src/demo/*.js',
    'demoDest': './demo/'
  };

  gulp.task('js', ['clean:js'], () => {
    gulp.src(config.src, (err, files) => {
      let tasks = files.map( (entry) => {
        return browserify({ entries: [entry] })
          .transform("babelify", {
            presets: ["es2015"],
            plugins: [
              "babel-plugin-syntax-jsx",
              "transform-es2015-spread",
              "transform-object-rest-spread",
              "babel-plugin-inferno"
            ]
          })
          .transform({
            'global': true,
            'compress': true,
            'mangle': true,
            'minify': true
          },'uglifyify')
          .bundle()
          .pipe(source(entry))
          .pipe(rename({
              dirname: '/',
              extname: '.bundle.js'
          }))
          .pipe(gulp.dest(config.dest))
      })
      es.merge(tasks);
    })
  });

    gulp.task('js:demo', ['clean:demo:js'], () => {
      gulp.src(config.demoSrc, (err, files) => {
        let tasks = files.map( (entry) => {
          return browserify({ entries: [entry] })
            .transform("babelify", {
              presets: ["es2015"],
              plugins: [
                "babel-plugin-syntax-jsx",
                "babel-plugin-inferno"
              ]
            })
            .transform({
              'global': true,
              'compress': true,
              'mangle': true,
              'minify': true
            },'uglifyify')
            .bundle()
            .pipe(source(entry))
            .pipe(rename({
                dirname: '/',
                extname: '.bundle.js'
            }))
            .pipe(gulp.dest(config.demoDest))
        })
        es.merge(tasks);
      })
    });

  gulp.task('js:watch', ['js', 'js:demo'], () => {
    gulp.watch(config.src, ['js']);
    gulp.watch(config.demoSrc, ['js:demo']);
  });

  // Clean the built directory
  gulp.task('clean:js', () => {
  return gulp.src(config.dest, { read: false }) // much faster
    .pipe(rimraf());
  });

  gulp.task('clean:demo:js', () => {
  return gulp.src(config.demoDest + '*.js', { read: false }) // much faster
    .pipe(rimraf());
  });
};
