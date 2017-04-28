// Import Dependancies
const fs = require('fs'),
      gulp = require('gulp'),
      webserver = require('gulp-webserver');

const directory = fs.realpathSync('./gulpfile.js').replace('/gulpfile.js', '');

module.exports = function(gulp){
  // Fires up the localhost test environment
  gulp.task('webserver', ['styles:watch', 'js:watch', 'views:watch', 'images:watch'], () => {
    gulp.src(`${directory}/dist`)
      .pipe(webserver({
        livereload: true,
        compression: true
      }));
  });
}
