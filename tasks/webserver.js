// Import Dependancies
const fs = require('fs'),
      gulp = require('gulp'),
      webserver = require('gulp-webserver');

const directory = JSON.parse(fs.readFileSync('./package.json')).directory || 'dist';

module.exports = function(gulp){
  // Fires up the localhost test environment
  gulp.task('webserver', ['styles:watch', 'js:watch', 'views:watch'], () => {
    gulp.src(`./${directory}`)
      .pipe(webserver({
        livereload: true,
        compression: true
      }));
  });
}
