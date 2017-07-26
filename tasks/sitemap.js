// Import Dependancies
const fs = require('fs'),
      gulp = require('gulp'),
      path = require('path'),
      sitemap = require('gulp-sitemap');

/***************************************************
 *  Views Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const directory = fs.realpathSync('./gulpfile.js').replace('gulpfile.js', '');
  const config = {
    'src': path.join(directory, 'dist/**/*.html'),
    'dest': path.join(directory, 'dist/'),
  };

  gulp.task('sitemap', function () {
    return gulp.src(config.src, {
      read: false
    })
    .pipe(sitemap({
      siteUrl: 'http://www.starsgroup.com',
      getLoc: function(siteUrl, loc, entry) {
          return loc.substr(0, loc.lastIndexOf('.')) || loc; // Removes the file extension
      }
    }))
    .pipe(gulp.dest(config.dest));
  });
};
