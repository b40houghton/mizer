'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	glob = require('glob'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	gulpif = require('gulp-if'),
	eventStream = require('event-stream'),
	autoprefixer = require('gulp-autoprefixer'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	babel = require('babelify'),
	uglify = require('gulp-uglify'),
	runSequence = require('run-sequence'),
	rename = require("gulp-rename");

var paths = {
	'styles':{
		'src':'./public/static/css/scss/**/*.scss',
		'dest':'./public/static/css/',
		'build':'./build/static/css/',
		'filename':'global'
	},
	'scripts':{
		'src':'./public/static/js/bundles/entry.js',
		'glob_src':'./public/static/js/bundles/**/entry.js',
		'dest':'./public/static/js/',
		'build':'./build/static/js/',
		'filename':'global'
	},
	'images': {
		'src':'./public/static/images/**/*',
		'dest':'./public/static/images/',
		'build':'./build/static/images/'
	}
}

var supported_browsers = [
  'ie >= 9',
  'ie_mob >= 9',
  'ff >= 35',
  'chrome >= 35',
  'safari >= 7',
  'opera >= 25',
  'ios >= 7',
  'android >= 4.3',
  'bb >= 10'
];

var env = gutil.env;

/*
	* ----------------------------- *
	| Browserify compile/watch func |
	* ----------------------------- *

	* Browserify - entry main.js
	* Watchify - enable watching for browserify
	* Babelify - Babel transform for browserify
	* Write sourcemaps if not production
	* Uglify if production
	* Rename to <FILENAME>-min.js if production
*/

function  compile (done, watch) {
	glob('./public/static/js/bundles/*.js', (err, files) => {
		if(err) done(err);

		var tasks = files.map( entry => {

			var b = browserify({
				entries: [entry],
				extensions: ['.js'],
				debug: true,
				cache: {},
				packageCache: {}
			}).transform("babelify", {
				presets: ["es2015"]
			});

			const bundle = () => {
				return b.bundle()
					.on('error', function (err) { console.log(err); this.emit('end'); })
					.pipe(source(entry))
					.pipe(buffer())
					.pipe(rename(function (path) {
						path.dirname = '';
						path.basename += '.bundle';
					}))
					.pipe(gulpif(env.node_env !== 'production', sourcemaps.init( { loadMaps: true } ))) // dev env only
					.pipe(gulpif(env.node_env !== 'production', sourcemaps.write())) // dev env only
					.pipe(gulpif(env.node_env !== 'production', gulp.dest(paths.scripts.dest))) // dev env only
					.pipe(gulpif(env.node_env === 'production', uglify())) //prod env only
					.pipe(gulpif(paths.scripts.filename.length && env.node_env === 'production', rename({prefix: paths.scripts.filename + '-'}))) //prod env only
					.pipe(gulpif(env.node_env === 'production', rename({suffix: '.min'}))) //prod env only
					.pipe(gulpif(env.node_env === 'production', gulp.dest(paths.scripts.build))); //prod env only
			};


			if (watch) {
				b = watchify(b);
				b.on('update', function () {
					console.log('-> bundling...');
					bundle();
				})
			}

			return bundle();
		});

		eventStream.merge(tasks).on('end', done);
	});
}

/*
	* ----------- *
	| Style tasks |
	* ----------- *

	* Write sourcemaps if not on production
	* Compile minified scss to css
	* Apply browser prefixs with autoprefixer
	* Rename file to <FILENAME>-min.css on production
	* Place in destination folder
*/

gulp.task('styles', function () {
	return gulp.src(paths.styles.src)
		.pipe(gulpif(env.node_env !== 'production', sourcemaps.init())) // dev env only
		.pipe(sass({ outputStyle: 'compressed'}))
		.pipe(autoprefixer(supported_browsers))
		.pipe(gulpif(env.node_env !== 'production', sourcemaps.write())) // dev env only
		.pipe(gulpif(env.node_env !== 'production', gulp.dest(paths.styles.dest))) // dev env only
		.pipe(gulpif(env.node_env === 'production' && paths.styles.filename.length, rename({prefix: paths.styles.filename + '-'}))) // prod env only
		.pipe(gulpif(env.node_env === 'production', rename({suffix: '-min'}))) // prod env only
		.pipe(gulpif(env.node_env === 'production', gulp.dest(paths.styles.build))); // prod env only
});

gulp.task('styles:watch', function () {
	gulp.watch('./public/static/css/scss/**/*.scss', ['styles']);
});

/*
	* ------------ *
	| Script tasks |
	* ------------ *

	* Browserify - entry main.js
	* Watchify - enable watching for browserify
	* Babelify - Babel transform for browserify
	* Write sourcemaps if not production
	* Uglify if production
*/

gulp.task('scripts', function (done) { return compile(done); });
gulp.task('scripts:watch', function (done) { return compile(done, true); });


/*
	* ------------ *
	| Images tasks |
	* ------------ *

	* move images to build folder
*/

gulp.task('images', function () {
	return gulp.src(paths.images.src)
		.pipe(gulp.dest(paths.images.build));
});

/*
	* ---------- *
	| Build task |
	* ---------- *

	* Run scripts build task
	* Run styles build task
	*
*/
gulp.task('build', ['styles','scripts', 'images']);


gulp.task('watch', ['styles','scripts'], function () {
	runSequence(['styles:watch', 'scripts:watch']);
});

gulp.task('default', ['styles', 'scripts']);
