/*!
 * gulp
 * $ npm install gulp-ftp gulp-util gulp-plumber gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-rimraf gulp-notify gulp-rename gulp-cache --save-dev
 */
 
// Load plugins
var gulp            = require('gulp'), //default gulp
    gutil           = require('gulp-util'), // gulp utilities
    plumber         = require('gulp-plumber'), // plumber - used to step over errors
    sass            = require('gulp-ruby-sass'), // sass
    autoprefixer    = require('gulp-autoprefixer'), //autoprefixer - used to itegrate autoprefixer into sass workflow
    minifycss       = require('gulp-minify-css'), //minify-css - minifies css files for dist
    jshint          = require('gulp-jshint'), //jshint - REMOVE
    uglify          = require('gulp-uglify'), //uglify - ??
    imagemin        = require('gulp-imagemin'), //imagemin - used to optimize images within images workflow
    rename          = require('gulp-rename'),
    clean           = require('gulp-rimraf'),
    concat          = require('gulp-concat'),
    notify          = require('gulp-notify'),
    cache           = require('gulp-cache'),
    nodemon         = require('gulp-nodemon'),
    handlebars      = require('gulp-handlebars'),
    svgSprite       = require('gulp-svg-sprites'),
    open            = require('open');

var paths = {
    scripts: ['src/assets/scripts/**/*.js'], // location of script files
    images: ['src/assets/images/**/*', '!src/assets/images/svg/symbols.svg'], //location of images and svg's, excluding generated svg file, "symbols.svg"
    svg:['src/assets/images/svg/*.svg', '!src/assets/images/svg/symbols.svg'], //location of svg's, excluding generated svg file, "symbols.svg"
    css:['src/assets/css/scss/**/*.scss'], // location of sass files
    html:[''],
    dist:['dist/**/*'] // distribution directory
}


// Styles - process sass, autoprefix, minify, alert when complete
gulp.task('styles', function() {
    return gulp.src(paths.css)
        .pipe(plumber())
        .pipe(sass({ style: 'expanded', lineNumbers: true }))
        .pipe(autoprefixer('last 2 version', '> 1%', 'firefox 28', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename(function(path){
            path.basename += ".min";
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: 'Styles task complete'}));
});
 
// Scripts - jshint, combine to one file, minify
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
 
// Images - compress images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});
 
// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/assets/css', 'dist/assets/scripts', 'dist/assets/images'], {read: false})
    .pipe(clean());
});
 
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

gulp.task('dev', function(){
    nodemon({script: 'index.js', ext: 'hbs js'})
        .on('start', ['watch'])
        .on('crash', ['dev'])
        .on('change',['watch'])
        .on('restart',['watch'])
});

gulp.task('build', function () {
    nodemon({script: 'index.js', ext: 'hbs js'}).on('restart', function(){
        
        setTimeout(function(){
        
            open('http://localhost:3000/build');
        
        }, 1000);
    
    }).restart();
    
});

gulp.task('sprites', function(){
    return gulp.src(paths.svg)
        .pipe(svgSprite({mode:"symbols", preview:false}))
        .pipe(gulp.dest('src/assets/images/'))
        .pipe(gulp.dest('dist/assets/images/'))
})

 
// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch(paths.css, ['styles']);
 
  // Watch .js files
  gulp.watch(paths.scripts, ['scripts']);
 
  // Watch image files
  gulp.watch(paths.images, ['images']);
 
});