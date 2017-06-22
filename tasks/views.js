// Import Dependancies
const fs = require('fs'),
      path = require('path'),
      gulp = require('gulp'),
      pug = require('pug'),
      data = require('gulp-data'),
      jsonfile = require('jsonfile'),
      rimraf = require('gulp-rimraf'),
      rename = require("gulp-rename"),
      map = require('map-stream'),
      buildHTML = require('./buildhtml'),
      gutil = require('gulp-util'),
      assignToPug = require('gulp-assign-to-pug');

/***************************************************
 *  Views Build Tasks
 ***************************************************/
module.exports = function(gulp){
  const directory = fs.realpathSync('./gulpfile.js').replace('gulpfile.js', '');
  const config = {
    'src': path.join(directory, 'src/pages/'),
    'templateSrc': path.join(directory, 'src/templates/'),
    'dest': path.join(directory, 'dist/'),
    'layoutPath': path.join(directory, '/src/templates/Layouts'),
    'defaultLayout': 'default',
    'layout': 'default'
  };

  let layout = pug.compile(fetchLayout(), {
    'basedir': 'src/'
  });

  // Parse directory tree to generate a navigation structure
  let navigationStructure = parseNav(config.src)
  const siteBaseData = requireUncached(`${config.src}/index.json`);

  // Node caches require requests, so sever needed to be restarted everytime data was updated
  function requireUncached( $module ) {
      delete require.cache[require.resolve( $module )];
      return require( $module );
  }

  // Walk directory and generate a hierarchical object of contents
  function parseNav(src, parent, level = 0) {
    // Empty Pages Object
    let pages = [];
    level = level + 1;
    try {
      // Read directory
       let dirContent = fs.readdirSync(src).filter( file => file !== '.DS_Store' );

      // If we're not at the top level, we want to ignore directories index.json file
      // This avoids duplicated 'curcular' JSON references
      if (parent) {
        dirContent = dirContent.filter( file => file !== 'index.json');
      }

      // Loop over each file/directory and read the meta data
      dirContent.forEach( (page, i) => {
        let pageData;
        // Is the file a directory?
        const isDir = fs.statSync(path.join(src, page)).isDirectory();
        // If so read said directory's index.json file for meta
        const pageMetaSrc = isDir
          ? path.join(src, page, 'index.json')
          : path.join(src, page);

        // read meta information in json file
        pageData = require(pageMetaSrc).meta;
        pageData.level = level;
        pageData.index = i;
        if (parent) {
          pageData.parent = parent;
        }

        // If file is a directory, we want to add a children object
        if (isDir) {
          pageData.base = `${parent ? parent : ''}/${path.basename(page)}`;
          pageData.link = `${pageData.base}/index.html`;

          const children = parseNav(path.join(src, page), `${pageData.parent ? pageData.parent : ''}/${page}`, level);
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

  // Check if page currently being parsed should be active in the menu
  // Also flags parents if child is active
  function parseActive(structure, currentPage) {
    let tmpStructure = structure;

    tmpStructure.map( (page) => {
      let isActive = false;
      let childActive = false;
      isActive = page.pageId === currentPage;

      if (page.children) {
        parseActive(page.children, currentPage)
        childActive = page.children.filter( (child) => child.isActive ).length > 0;
      }

      page.isActive = isActive || childActive;
    });

    return tmpStructure
  }

  function findLowestActive(pages) {
    let active = pages.filter( page => page.isActive )[0],
      childActive = false;

    if(active && active.children) {
      childActive = findLowestActive(active.children);
    }

    return childActive ? childActive : active
  }

  function nestChildren(file, pageId, structure, template) {
    const src = file.replace("index.json", "");
    const active = findLowestActive(structure);
    let dirContent = fs.readdirSync(src).filter( file => (file !== '.DS_Store' && file !== 'index.json' ) );

    dirContent = dirContent.map( (page, i) => {
     let data = require(path.join(src, page));
     data.base = active.base;
     return data
    });

    return dirContent.sort( (a, b) => b.meta.publishDate - a.meta.publishDate )
  }

  function fetchLayout() {
    return fs.readFileSync(`${config.layoutPath}/${config.layout}.pug`, 'utf8')
  }

  gulp.task('views', ['clean:views'], () => {
    return gulp.src(`${config.src}/**/*.json`)
      // Add nav structure to the data object
      .pipe(data( (file) => {
        gutil.log(gutil.colors.green('Rendering view:'), file.path);
        let data = requireUncached(file.path);
        config.layout = data.meta.layout !== undefined ? data.meta.layout : config.defaultLayout;
        const pageData = parseActive(navigationStructure, data.meta.pageId);
        data.meta = Object.assign({}, siteBaseData.meta, data.meta);
        data.structure = pageData;
        if (data.meta.nestChildren) {
          data.nestedChildren = nestChildren(file.path, data.meta.pageId, pageData, data.childTemplate);
        }
        data.global = Object.assign({}, siteBaseData.global, data.global);
        return data
      }))
      // render the templates
      .pipe( buildHTML(layout) )
      .pipe( rename({
        extname: '.html'
      }) )
      .pipe( gulp.dest(config.dest) )
  });

  gulp.task('views:watch', ['views'], () => {
    gulp.watch(`${config.src}/**/*.*`, ['views']);
    gulp.watch(`${config.templateSrc}/**/*.*`, ['updateLayout', 'views']);
  });

  gulp.task('updateLayout', () => {
    layout = pug.compile(fetchLayout(), {
      'basedir': 'src/'
    });
  });


  // Clean the built directory
  gulp.task('clean:views', () => {
  return gulp.src(config.dest + '**/*.html', { read: false }) // much faster
    .pipe(rimraf());
  });
};
