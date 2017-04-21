// add this to your gulpfile.js
const gulp = require('gulp');

require('./tasks/scripts')(gulp);
require('./tasks/styles')(gulp);
require('./tasks/views')(gulp);
require('./tasks/webserver')(gulp);

gulp.task('default', ['styles', 'js', 'views']);
