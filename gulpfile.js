'use strict';

// Load plugins
var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var del = require('del');
var fs = require('fs');
var sequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plugins = loadPlugins({
        rename: {
            'gulp-svg-symbols': 'symbols'
        }
    });


// site paths
var paths = {
    src: {
        root: ['src/'],
        html: 'src/views/pages/*.hbs',
        models: 'src/models/**/*.json',
        scripts: {
            root: 'src/assets/scripts/',
            head: 'src/assets/scripts/head/**/*.js',
            body: ['src/assets/scripts/body/global/**/*.js', 'src/assets/scripts/body/modules/**/*.js', 'src/assets/scripts/body/**/*.js']
        },
        image: ['src/assets/images/**/*', '!src/assets/images/svg/symbols.svg'],
        css: 'src/assets/css/scss/**/*.scss',
        svg: ['src/assets/images/svg/*.svg', '!src/assets/images/svg/symbols.svg']
    },
    dist: {
        root: 'dist',
        scripts: ['dist/assets/scripts/'],
        image: ['dist/assets/images/'],
        css: 'dist/assets/css',
        svg: ['src/assets/images/svg/']
    }
};

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

gulp.task('scripts', function () {

    gulp.src(paths.src.scripts.head)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('head.js'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.src.scripts.root));

    console.log(paths.src.scripts.root + 'head.js written');

    gulp.src(paths.src.scripts.body)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('body.js'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.src.scripts.root));

    console.log(paths.src.scripts.root + 'body.js written');
});

gulp.task('styles', function () {
    gulp.src(paths.src.css)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write({
            includeContent: false
        }))
        .pipe(plugins.autoprefixer(browsers))
        .pipe(gulp.dest('src/assets/css/'))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(plugins.sourcemaps.init({
            loadMaps: true
        }))
        .pipe(plugins.rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write({
            includeContent: false
        }))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('build', ['styles', 'scripts'], function () {
    gulp.src(paths.src.html)
        .pipe(plugins.hb({
            data: paths.src.root + '/models/**/*.json',
            helpers: paths.src.root + '/assets/scripts/helpers/*.js',
            partials: paths.src.root + '/views/partials/**/*.hbs'
        }))
        .pipe(plugins.rename(function (path){
            path.extname = '.html';
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('browser-sync', ['dev'], function () {
    setTimeout(function () {
        browserSync.init(null, {
            proxy: "http://localhost:3000",
            files: ["dist/**/*"],
            port: 3001,
            startPath: "/index"
        });
    }, 1000);

});

gulp.task('dev', ['clean', 'styles', 'scripts'], function (callback) {
    var called = false;

    return plugins.nodemon({
        script: 'index.js'
    }).on('start', function () {
        if (!called) {
            called = true;
            callback();
        }
    });
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('sync', ['styles', 'scripts', 'browser-sync'], function () {
    gulp.watch(['src/assets/css/scss/**/*.scss'], ['styles']);
    gulp.watch(['src/assets/js/**/*.js'], reload);
});

gulp.task('default', ['clean', 'styles']);