// Import Dependancies
const fs = require('fs'),
      path = require('path'),
      gulp = require('gulp'),
      pug = require('gulp-pug'),
      data = require('gulp-data'),
      jsonfile = require('jsonfile'),
      rimraf = require('gulp-rimraf'),
      rename = require("gulp-rename"),
      assignToPug = require('gulp-assign-to-pug');

/***************************************************
 *  Views Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const directory = fs.realpathSync('./gulpfile.js').replace('/gulpfile.js', '');
  const config = {
    'src': path.join(directory, 'src/pages/'),
    'templateSrc': path.join(directory, 'src/templates/'),
    'dest': path.join(directory, 'dist/'),
    'defaultLayout': path.join(directory, '/src/templates/Layouts/default.pug')
  };

  // Walk directory and generate a hierarchical object of contents
  function parseNav(src, parent) {
    // Empty Pages Object
    let pages = [];
    try {
      // Read directory
      let dirContent = fs.readdirSync(src);

      // If we're not at the top level, we want to ignore directories index.json file
      // This avoids duplicated 'curcular' JSON references
      if (parent) {
        dirContent = dirContent.filter( file => file !== 'index.json');
      }

      // Loop over each file/directory and read the meta data
      dirContent.forEach( page => {
        let pageData;
        // Is the file a directory?
        const isDir = fs.statSync(path.join(src, page)).isDirectory();
        // If so read said directory's index.json file for meta
        const pageMetaSrc = isDir
          ? path.join(src, page, 'index.json')
          : path.join(src, page);

        // read meta information in json file
        pageData = require(pageMetaSrc).meta;
        if (parent) {
          pageData.parent = parent;
        }


        // If file is a directory, we want to add a children object
        if (isDir) {
          pageData.link = `${parent ? parent : ''}/${path.basename(page)}/index.html`;
          const children = parseNav(path.join(src, page), `${pageData.parent ? pageData.parent : ''}/${pageData.slug}`);
          // If there are children returned, add them to the object
          if (Object.keys(children).length) {
            pageData.children = children;
          }
        } else {
          pageData.link = `${parent ? parent : ''}/${path.basename(page).replace('.json', '.html')}`;
        }
        pages.push(pageData);
      });

      pages = pages.sort( (a, b) => {
        return a.menuOrder > b.menuOrder
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
      // Add nav structure to the data object
      .pipe(data( (file) => {
        let data = require(file.path);
        data.structure = navigationStructure;
        return data
      }))
      // render the templates
      .pipe( assignToPug(config.defaultLayout, {
        basedir: 'src',

      }))
      .pipe( gulp.dest(config.dest) )
  });

  gulp.task('views:watch', ['views'], () => {
    gulp.watch(`${config.src}/**/*.*`, ['views']);
    gulp.watch(`${config.templateSrc}/**/*.*`, ['views']);
  });

  // Clean the built directory
  gulp.task('clean:views', () => {
  return gulp.src(config.dest + '**/*.html', { read: false }) // much faster
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
