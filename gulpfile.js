'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    includer     = require("gulp-x-includer"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    path = require('path'),
    cheerio = require('gulp-cheerio');

var way = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        styles: 'src/styles/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/*.html',
        html_template: 'src/template/*.html',
        js: 'src/js/*.js',
        styles: 'src/styles/*.scss',
        styles_blocks: 'src/styles/bocks/*.scss',
        styles_common: 'src/styles/common/*.scss',
        styles_lib: 'src/styles/lib/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "frontend"
};

gulp.task('svgstore', function () {
    return gulp
        .src('./src/sprite/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('./build/img'));
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(way.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(way.src.html)
        .pipe(includer())
        .pipe(gulp.dest(way.build.html))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js:build', function () {
    gulp.src(way.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(way.build.js))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('styles:build', function () {
    gulp.src(way.src.styles)
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['src/styles/'],
            errLogToConsole: true
        }).on('error', sass.logError)) //Скомпилируем
        .pipe(gulp.dest(way.build.css)) //И в build
        .pipe(rename({
            prefix: "",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        })) //Добавим вендорные префиксы
        .pipe(cleanCSS({debug: true}, function (details) {//Сожмем
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest(way.build.css)) //И в build
        .pipe(reload({
            stream: true
        }));
});

gulp.task('image:build', function () {
    gulp.src(way.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(way.build.img))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('fonts:build', function () {
    gulp.src(way.src.fonts)
        .pipe(gulp.dest(way.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'styles:build',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function () {
    watch([way.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([way.watch.html_template], function (event, cb) {
        gulp.start('html:build');
    });
    watch([way.watch.styles], function (event, cb) {
        gulp.start('styles:build');
    });
    watch([way.watch.styles_common], function (event, cb) {
        gulp.start('styles:build');
    });
    watch([way.watch.styles_blocks], function (event, cb) {
        gulp.start('styles:build');
    });
    watch([way.watch.styles_lib], function (event, cb) {
        gulp.start('styles:build');
    });
    watch([way.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([way.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([way.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);
