let gulp = require('gulp'), // Сам gulp
    sass = require('gulp-sass'), // Компиляция стилей
    minifyJs = require('gulp-terser'), // Минификация js
    autoPrefixer = require('gulp-autoprefixer'), // Вендорные префиксы
    bs = require('browser-sync'), // Server
    htmlMin = require('gulp-htmlmin'), // Минификация html
    rename = require('gulp-rename'), //Rename
    delFiles = require('del'), // Delete files
    cssMinify = require('gulp-csso'), // Minify css
    babel = require('gulp-babel'), // babel
    jsonMinify = require('gulp-json-minify'),
    imagemin = require('gulp-imagemin'),
    jpegrecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    pug = require('gulp-pug'); // pug


// Gulp methods
// gulp.task() - создать новую задачу
// gulp.src() - выбор файлов
// gulp.dest() - сохранение/перенос файлов
// gulp.series() - задачи запускаются по порядку
// gulp.parallel() - задачи запускаются параллельно
// gulp.watch() - следит за файлами

gulp.task('test', () => {
   return console.log('gulp works');
});

gulp.task('sass', () => {
    // return gulp.src('app/sass/**/*.scss')
    // return gulp.src('app/sass/**/*.+(scss|sass)')
    // return gulp.src(['app/img/**/*.+(jpg|png|gif|svg)', 'app/content/*.jpg'])
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssMinify())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('image:build', () =>  {
    return gulp.src('app/img/**/*.*')
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant()
        ])))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', () => {
    return delFiles('dist');
});

gulp.task('pug', () => {
    return gulp.src('app/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app/html'))
});


gulp.task('html', () => {
    return gulp.src('app/html/index.html')
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'));
});



gulp.task('js:es6', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(minifyJs())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
});
gulp.task('json:minify', () => {
    return gulp.src('app/js/**/*.json')
        .pipe(jsonMinify())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('js:babel', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename({
            suffix: '.es5'
        }))
        .pipe(gulp.dest('dist/js'))
});
gulp.task('server', () => {
    return bs({
        server: {
            baseDir: 'dist'
        },
        browser: 'google chrome'
    })
});

gulp.task('sass:watch', () => {
    return gulp.watch('app/sass/**/*.scss', gulp.series('sass', (done) => {
        bs.reload();
        done()
    }))
});
gulp.task('js:watch', () => {
    return gulp.watch('app/js/**/*.js', gulp.series('js:es6', (done) => {
        bs.reload();
        done()
    }))
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('sass', 'image:build', 'html', 'pug', 'js:es6', 'json:minify', 'js:babel'),
    gulp.parallel('sass:watch', 'js:watch','server')
));
















