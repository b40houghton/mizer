'use strict';

// Load plugins
var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var del = require('del');
var path = require('path');
var fs = require('fs');
var ms = require('merge-stream');
var sequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plugins = loadPlugins({
    rename: {
        'gulp-svg-symbols': 'symbols'
    }
});
var shell = require('shelljs');

// site paths
var paths = {
    src: {
        root: ['src/'],
        html: 'src/views/pages/*.hbs',
        models: 'src/models/**/*.json',
        scripts: {
            root: 'src/assets/scripts/',
            head: 'src/assets/scripts/head/**/*.js',
            body: ['src/assets/scripts/body/global/**/*.js', 'src/assets/scripts/body/modules/**/*.js', 'src/assets/scripts/body/**/*.js'],
            build: ['src/assets/scripts/**/*.js', '!src/assets/scripts/archive', '!src/assets/scripts/body', '!src/assets/scripts/helpers']
        },
        image: ['src/assets/images/**/*', '!src/assets/images/svg/symbols.svg'],
        css: 'src/assets/css/scss/**/*.scss',
        svg: ['src/assets/images/svg/*.svg', '!src/assets/images/svg/symbols.svg'],
        handlebarsInput: 'src/assets/scripts/handlebars',
        handlebarsOutput: 'src/assets/scripts/body/global/compiled-hbs.js'
    },
    dist: {
        root: 'dist',
        scripts: ['dist/assets/scripts/'],
        image: 'dist/assets/images/',
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

var svgConfig = {
    mode: {
        symbol: true
    }
};


//compile scripts from head and body directories
gulp.task('scripts', function () {
    var headScripts = gulp.src(paths.src.scripts.head)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('head.js'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.src.scripts.root));

    var bodyScripts = gulp.src(paths.src.scripts.body)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('body.js'))
        .pipe(plugins.sourcemaps.write());

    return ms(headScripts, bodyScripts).pipe(gulp.dest(paths.src.scripts.root));
});

// scripts build task - minify and place in dist
gulp.task('build-scripts', function () {
    return gulp.src(paths.src.scripts.build)
        .pipe(gulp.dest('./dist/assets/scripts'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('./dist/assets/scripts'));
});

//compile scss and sourcemaps into main.css and appropriate files
gulp.task('styles', function () {
    return gulp.src(paths.src.css)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({errLogToConsole: true}))
        .pipe(plugins.autoprefixer(browsers))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('src/assets/css/'))
        .pipe(reload({
            stream: true
        }));
});

//minify and place css in dist
gulp.task('build-styles', function () {
    return gulp.src('src/assets/css/**/*.css')
        .pipe(gulp.dest(paths.dist.css))
        .pipe(plugins.sourcemaps.init({ loadMaps: true }))
        .pipe(plugins.rename(function (path) { path.basename += ".min"; }))
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write({ includeContent: false }))
        .pipe(gulp.dest(paths.dist.css));
});

//optimize images
gulp.task('images', ['sprites'], function () {
    return gulp.src(paths.src.image)
        .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(paths.dist.image));
});

//build svg into single file
gulp.task('sprites', function () {
    return gulp.src(paths.src.svg)
        .pipe(plugins.svgSprite(svgConfig))
        .pipe(gulp.dest('src/assets/images/'))
        .pipe(gulp.dest(paths.dist.image));
});

//build handlebars templates to html and place in dist
gulp.task('html', function () {
    return gulp.src(paths.src.html)
        .pipe(plugins.hb({
            data: paths.src.root + '/models/**/*.json',
            helpers: paths.src.root + '/assets/scripts/helpers/*.js',
            partials: paths.src.root + '/views/partials/**/*.hbs'
        }))
        .pipe(plugins.rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest('./dist'));
});

//run build specific tasks
gulp.task('build', ['build-styles', 'build-scripts', 'html'], function () {
    return;
});

//sync browser using browser-sync
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

//dev using nodemon
gulp.task('dev', ['clean', 'styles', 'scripts'], function (callback) {
    var called = false;

    return plugins.nodemon({
        script: 'index.js',
        ext:'hbs js scss',
        tasks: ['clean', 'styles', 'scripts']
    }).on('start', function () {
        if (!called) {
            called = true;
            callback();
        }
    });
});

//delete dist folder
gulp.task('clean', del.bind(null, ['dist']));

//sync and watch
gulp.task('sync', ['styles', 'scripts', 'browser-sync'], function () {
    gulp.watch(['src/assets/css/scss/**/*.scss'], ['styles']);
    gulp.watch(['src/assets/js/**/*.js'], reload);
});

//default
gulp.task('default', ['clean', 'styles']);

//handlebars templates precompilation
gulp.task('precompile', function () {
    var commandString = 'handlebars -m ' + paths.src.handlebarsInput + ' -f ' + paths.src.handlebarsOutput;
    shell.exec(commandString);
    // shell.echo(commandString);
});