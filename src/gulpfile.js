const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const touch = require('gulp-touch-fd');
const pugData = require('./pug/data.js');

const OUTPUT_DIR = '..';

const paths = {
  html: {
    src: ['./pug/**/*.pug', '!./pug/include/**/*.pug', '!./pug/tpl/**/*.pug', '!./pug/sections/**/*.pug'],
    watchSrc: './pug/**/*.pug',
    dest: `${OUTPUT_DIR}`,
  },
  styles: {
    src: './sass/**/*.scss',
    dest: `${OUTPUT_DIR}/assets/css`,
  },
  scripts: {
    src: './js/main.js',
    watchSrc: ['./js/**/*.js', '!./js/genie-worker.js', '!./js/dependencies.js'],
    dest: `${OUTPUT_DIR}/assets/js`,
    filename: 'bundle',
  },
  genieWorker: {
    src: './js/genie-worker.js',
    dest: `${OUTPUT_DIR}/assets/js`,
    filename: 'genie-worker',
  },
  dependencies: {
    src: './js/dependencies.js',
    dest: `${OUTPUT_DIR}/assets/js`,
    filename: 'dependencies',
  },
};

function html() {
  return gulp.src(paths.html.src)
    .pipe(pug({
      pretty: true,
      data: pugData,
    })).pipe(rename({
      extname: '.html',
    })).pipe(
      gulp.dest(paths.html.dest)
    )
    .pipe(touch());
}

function styles() {
  return gulp.src(paths.styles.src, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
}

function es(entrypoint, outputName) {
  return browserify({
    extensions: ['.js', '.jsx'],
    entries: entrypoint,
    debug: true,
  })
    .transform('babelify', { presets: ['@babel/env'], sourceMaps: true })
    .on('error', (msg) => {
      // eslint-disable-next-line no-console
      console.error(msg);
    })
    .bundle()
    .pipe(source(`${outputName}.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(rename(`${outputName}.min.js`))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function genieWorker() {
  return es(paths.genieWorker.src, paths.genieWorker.filename);
}

function dependencies() {
  return es(paths.dependencies.src, paths.dependencies.filename);
}

function scripts() {
  return es(paths.scripts.src, paths.scripts.filename);
}

function watch() {
  gulp.watch(paths.html.watchSrc || paths.html.src, html);
  gulp.watch(paths.styles.watchSrc || paths.styles.src, styles);
  gulp.watch(paths.genieWorker.watchSrc || paths.genieWorker.src, genieWorker);
  gulp.watch(paths.dependencies.watchSrc || paths.dependencies.src, dependencies);
  gulp.watch(paths.scripts.watchSrc || paths.scripts.src, scripts);
}

const build = gulp.parallel(html, styles, scripts, dependencies);

exports.html = html;
exports.styles = styles;
exports.dependencies = dependencies;
exports.genieWorker = genieWorker;
exports.scripts = scripts;
exports.watch = watch;

exports.build = build;
exports.default = build;
