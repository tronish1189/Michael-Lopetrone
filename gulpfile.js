const { src, dest, watch, series } = require("gulp");
const browsersync = require("browser-sync").create(),
  sass = require("gulp-sass")(require("sass")),
  rename = require("gulp-rename"),
  autoprefixer = require("autoprefixer"),
  minifycss = require("gulp-minify-css"),
  sourcemaps = require("gulp-sourcemaps"),
  cssnano = require("cssnano"),
  postcss = require("gulp-postcss"),
  imagemin = require("gulp-imagemin"),
  babel = require("gulp-babel");

// Default Gulp Task
exports.default = series(scssTask, browsersyncServe, watchTask);

// Sass Task
function scssTask() {
  return src("static/scss/styles.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ style: "expanded" }))
    .pipe(postcss([autoprefixer({ grid: "autoplace" }), cssnano()]))
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./dist/css/"));
}

//JS Task
function jsTask() {
  return src("static/js/scripts.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
        compact: true,
      })
    )
    .pipe(dest("./dist/js/"));
}

//Image minify task
function imageTask() {
  return src("static/img/*").pipe(imagemin()).pipe(dest("./dist/img"));
}

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "./",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch(["*.html"], browsersyncReload);
  watch(
    ["static/**/*.scss", "/static/*.scss", "*.html"],
    series(scssTask, jsTask, imageTask, browsersyncReload)
  );
}
