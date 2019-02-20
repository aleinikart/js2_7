"use strict";

var config = {
    server: {
        baseDir: './dist'
    },
    notify: false
};

var path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        jsmain: 'dist/js',
        css: 'dist/css/',
        img: 'dist/img/'
    },
    app: {
        html: 'app/*.html',
        js: 'app/js/*.js',
        jsmain: 'app/js/main.js',
        scss: 'app/css/main.scss',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*'
    },
    watch: {
        html: 'app/*.html',
        htmlTemplate:'app/template/*.html',
        js: 'app/js/*.js',
        jsmain: 'app/js/main.js',
        scss: 'app/css/*.scss',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*'
    },
    clean: './dist/'
};

var gulp = require("gulp"),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    rigger = require('gulp-rigger'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    jpegrecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    concat = require('gulp-concat'),
    postcss = require('gulp-postcss');


gulp.task('browserSync', function (done) {
    browserSync.init(config);
    done();
});

gulp.task('html:build', function (done) {
    gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.dist.html))
        .pipe(browserSync.reload({stream: true}));
    done();
});

gulp.task('scss:build', function (done) {
    gulp.src(path.app.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer({browsers: ['last 2 version']})]))
        .pipe(cleanCSS({
            level: 2
        }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.reload({stream: true}));
    done();
});

gulp.task('css:build', function (done) {
    gulp.src(path.app.css)
        .pipe(concat('libs.css'))
        .pipe(cleanCSS({
            level: 2
        }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(gulp.dest(path.dist.css));
    done();
});

gulp.task('jsmain:build', function (done) {
    gulp.src(path.app.jsmain)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.dist.jsmain))
        .pipe(browserSync.reload({stream: true}));
    done();
});

gulp.task('js:build', function (done) {
    gulp.src([path.app.js, '!app/js/main.js'])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js));
    done();
});

gulp.task('fonts:build', function (done) {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts));
    done();
});

gulp.task('image:build', function (done) {
    gulp.src(path.app.img)
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
        ])))
        .pipe(gulp.dest(path.dist.img));
    done();
});

gulp.task('clean:build', function (done) {
    del.sync(path.clean);
    done();
});

gulp.task('cache:clear', function (done) {
    cache.clearAll();
    done();
});

gulp.task('build', gulp.series('clean:build', 'html:build', 'scss:build', 'css:build', 'js:build', 'jsmain:build', 'image:build', function (done) {
    done();
}));


gulp.task('watch', function () {
    gulp.watch(path.watch.html,gulp.series('html:build'));
    gulp.watch(path.watch.htmlTemplate,gulp.series('html:build'));
    gulp.watch(path.watch.css,gulp.series('css:build'));
    gulp.watch(path.watch.scss,gulp.series('scss:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.jsmain, gulp.series('jsmain:build'));
});


gulp.task('default', gulp.series('clean:build', 'build', gulp.parallel('browserSync', 'watch')));
