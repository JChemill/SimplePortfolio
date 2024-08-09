const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// Compile SCSS to CSS
function styles() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Minify JavaScript
function scripts() {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

// Copy HTML files to dist
function html() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Watch files for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch('src/scss/**/*.scss', styles);
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch('src/**/*.html', html).on('change', browserSync.reload);
}

// Define complex tasks
const build = gulp.series(gulp.parallel(styles, scripts, html), watch);

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.watch = watch;
exports.default = build;

// Define default task
module.exports.default = gulp.series(gulp.parallel(styles, scripts), watch);
