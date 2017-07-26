// Import Dependancies
const fs = require('fs'),
      gulp = require('gulp'),
      webserver = require('gulp-webserver'),
      path = require('path');

const directory = fs.realpathSync('./gulpfile.js').replace('gulpfile.js', '');

module.exports = function(gulp){
  // Fires up the localhost test environment
  gulp.task('webserver', ['styles:watch', 'js:watch', 'views:watch', 'images:watch'], () => {
    gulp.src(path.join(directory, 'dist'))
      .pipe(webserver({
        livereload: true,
        compression: true,
        middleware: function (req, res, next) {
          // Stuff to be ignored
          if (req.url.indexOf('css') >= 0 || req.url.indexOf('js') >= 0 || req.url.indexOf('images') >= 0) {
            next();
            return
          }

          // If `/` is requested. append index to it
          if (req.url === '/') {
            req.url = '/index';
          }
          const url = req.url + '.html';
          req.url = url;
          next();
        }
      }));
  });
}
