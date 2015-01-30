
'use strict';

// Load plugins
var gulp            = require('gulp'),
	loadPlugins		= require('gulp-load-plugins'),
	del				= require('del'),
	sequence		= require('run-sequence'),
	browserSync		= require('browser-sync'),
	reload			= browserSync.reload,
	plugins 		= loadPlugins({
		rename: {
			'gulp-ruby-sass':'sass',
			'gulp-svg-symbols':'symbols'
		}
	});


// site paths
var paths = {
	src: {
		root:['src/'],
		html:'src/views/pages/*.hbs',
		scripts:['src/assets/scripts/**/*.js'],
		image:['src/assets/images/**/*', '!src/assets/images/svg/symbols.svg'],
		css:'src/assets/css/scss',
		svg:['src/assets/images/svg/*.svg', '!src/assets/images/svg/symbols.svg']
	},
	dist: {
		root:'dist',
		scripts:['dist/assets/scripts/'],
		image:['dist/assets/images/'],
		css:'dist/assets/css',
		svg:['src/assets/images/svg/']
	}
}

// browsers for autoprefixer
var browsers = [
	'ie >= 9',
	'ie_mob >= 9',
	'ff >= 35',
	'chrome >= 35',
	'safari >= 7',
	'opera >= 25',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10' 
]; 

gulp.task('styles', function() {
	return plugins.sass(paths.src.css,  { style: "expanded", lineNumbers:true })
		.on('error', function(err){console.log(err.message); })
		.pipe(plugins.autoprefixer(browsers))
		.pipe(gulp.dest('src/assets/css'))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(plugins.rename(function(path){
            path.basename += ".min"
        }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(reload({stream:true}));
});

gulp.task('browser-sync', ['run-nodemon'], function(){
	//wait for the server to start before running
	setTimeout(function(){
		browserSync.init(null, {
			proxy: "http://localhost:3000",
			files:["dist/**/*"],
			port:3001,
			startPath:"/pages/index"
		});
	}, 1000);
	
});

gulp.task('run-nodemon', function(callback){
	var called = false;

	return plugins.nodemon({
		script:'index.js'
	}).on('start',function(){
		if(!called){
			called = true;
			callback();
		}
	});
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('dev', ['styles','browser-sync'], function(){
	gulp.watch(['src/assets/css/scss/**/*.scss'], ['styles']);
	gulp.watch(['src/assets/js/**/*.js'], reload);
});

gulp.task('default', ['clean', 'styles']);