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
    'dest': './dist/js'
  };
  gulp.task('js', ['clean:js'], () => {
    gulp.src(config.src, (err, files) => {
      let tasks = files.map( (entry) => {
        return browserify({ entries: [entry] })
          .transform("babelify", {presets: ["es2015"]})
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

  gulp.task('js:watch', ['js'], () => {
    gulp.watch("./src/js/**.js", ['js']);
  });

  // Clean the built directory
  gulp.task('clean:js', () => {
  return gulp.src(config.dest, { read: false }) // much faster
    .pipe(rimraf());
  });
};
