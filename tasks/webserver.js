// Import Dependancies
const gulp = require('gulp'),
      webserver = require('gulp-webserver');

module.exports = function(gulp){
  // Fires up the localhost test environment
  gulp.task('webserver', ['sass:watch', 'views:watch'], () => {
    gulp.src('./dist/')
      .pipe(webserver({
        livereload: true,
        directoryListing: false,
        compression: true
      }));
  });
}
