// Import Dependancies
const gulp = require('gulp'),
      webserver = require('gulp-webserver');

module.exports = function(gulp){
  // Fires up the localhost test environment
  gulp.task('webserver', ['styles:watch', 'js:watch', 'views:watch'], () => {
    gulp.src('./')
      .pipe(webserver({
        livereload: true,
        directoryListing: false,
        compression: true
      }));
  });
}
