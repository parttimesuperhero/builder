'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var pug = require('pug');

function compile(layout) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-template', 'Streaming not supported'));
			return;
		}

		if (file.data.meta.hidden) {
			gutil.log(gutil.colors.blue('Skipping Hidden Page:'), file.path);
			cb(null, null);
			return;
		}

		try {
			file.contents = new Buffer(layout(file.data));
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-template', err, {fileName: file.path}));
		}
		cb();
	});
}

module.exports = function (layout, file) {
	return compile(layout);
};
