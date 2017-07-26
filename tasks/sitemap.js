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
      siteUrl: 'http://www.starsgroup.com'
    }))
    .pipe(gulp.dest(config.dest));
  });
};
