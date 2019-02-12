var gulp       = require('gulp'), // Подключаем Gulp
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    uglify      = require('gulp-uglifyjs'),
    babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('css-libs', function() {
    return gulp.src('app/css/style.css')
        .pipe(autoprefixer(['last 2 versions'], { cascade: true }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
    return gulp.src('app/js/script.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});


gulp.task('build', function() {
    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel('css-libs', 'scripts'));
