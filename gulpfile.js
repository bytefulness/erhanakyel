'use strict';

// Initialize modules
// Importing specific Gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');

// Importing all the Gulp-related packages we want to use
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');

// Path files
const files = {
  htmlPath: './*.html',
  scssPath: 'src/scss/**/*.scss',
  jsPath: 'src/js/**/*.js',
  imagesPath: 'src/assets/images/**/*',
};

// Tasks

// imageMin: Optimization for images
function imageMin() {
  return src(files.imagesPath)
    .pipe(imagemin())
    .pipe(dest('dist/assets/images/'));
}

// Sass Task: Compile the main.scss file into style.css
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('dist/styleeshet')) // put final CSS in dist folder
    .pipe(browserSync.stream()); // This won't reload page but inject changes without refresh  the page thus you'll see any changes without have to go top of the page.
}

// exports.scssTask = scssTask; // If you want to just ivoke this task.

// JS Task: Concatenates and uglify JS files into all.js
function jsTask() {
  return src([
    files.jsPath,
    //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
  ])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('dist/script'))
    .pipe(browserSync.stream());
}

// Watch Task: watch SCSS and Js file for changes
// If any change, run scss and js tasks simultaneously

function watchTask() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  }); // It"ll create a server.
  // Track img folder
  watch('src/assets/images/', imageMin);
  watch(files.htmlPath).on('change', browserSync.reload); // It will refresh page.
  // Watch image folder
  watch(
    [files.scssPath, files.jsPath],
    { interval: 1000, usePolling: true }, //Makes docker work
    series(parallel(scssTask, jsTask))
  );
}

// Export the default Gulp task so it can be run
// Runs the scss and js task simultaneously
// then runs cacheBust, then watch task

// exports.default = series(parallel(scssTask, jsTask), cacheBustTask, watchTask);

exports.default = series(parallel(scssTask, jsTask), imageMin, watchTask);
