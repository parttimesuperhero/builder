// Import Dependancies
const fs = require('fs'),
      gulp = require('gulp'),
      pug = require('gulp-pug'),
      rimraf = require('gulp-rimraf'),
      data = require('gulp-data'),
      jsonfile = require('jsonfile'),
      path = require('path'),
      assignToPug = require('gulp-assign-to-pug');

/***************************************************
 *  Views Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const config = {
    'src': './src/pages/',
    'dest': './dist/',
    'defaultLayout': path.normalize(path.join(__dirname, '../src/templates/Layouts/default.pug'))
  };

  // Walk directory and generate a hierarchical object of contents
  function parseNav(src, child) {
    // Empty Pages Object
    let pages = {};
    try {
      // Read directory
      let dirContent = fs.readdirSync(src);

      // If we're not at the top level, we want to ignore directories index.json file
      // This avoids duplicated 'curcular' JSON references
      if (child) {
        dirContent = dirContent.filter( file => file !== 'index.json');
      }

      // Loop over each file/directory and read the meta data
      dirContent.forEach( page => {
        // Is the file a directory?
        const isDir = fs.statSync(path.join(src, page)).isDirectory();
        // If so read said directory's index.json file for meta
        const pageMetaSrc = isDir
          ? path.join('../', src, page, 'index.json')
          : path.join('../', src, page);
        // read meta information in json file
        const pageMeta = require(pageMetaSrc).meta;

        pages[pageMeta.pageId] = pageMeta;

        // If file is a directory, we want to add a children object
        if (isDir) {
          const children = parseNav(path.join(src, page), true);
          // If there are children returned, add them to the object
          if (Object.keys(children).length) {
            pages[pageMeta.pageId].children = children;
          }
        }
      });
      return pages;
    } catch (err) {
      console.log(`ERROR:: Directory ${src} has some issues.`);
      console.log(err);
    }
  }

  gulp.task('views', ['clean:views'], () => {
    // Parse directory tree to generate a navigation structure
    let navigationStructure = parseNav(config.src);

    return gulp.src(`${config.src}/**/*.json`)
      // add nav structure to the data object
      .pipe(data( (data) => {
        data.structure = navigationStructure;
        return data
      }))
      // render the templates
      .pipe( assignToPug(config.defaultLayout, {
        basedir: 'src'
      }) )
      .pipe( gulp.dest(config.dest) )
  });

  gulp.task('views:watch', ['views'], () => {
    gulp.watch(config.src, ['views']);
  });

  // Clean the built directory
  gulp.task('clean:views', () => {
  return gulp.src(config.dest + '*.html', { read: false }) // much faster
    .pipe(rimraf());
  });

  // gulp.task('views:demo', ['clean:demo:views'], () => {
  //   return gulp.src(config.demoSrc)
  //     .pipe(pug())
  //     .pipe(gulp.dest(config.demoDest))
  // });
  // gulp.task('clean:demo:views', () => {
  // return gulp.src(config.demoDest + '*.html', { read: false }) // much faster
  //   .pipe(rimraf());
  // });
};
