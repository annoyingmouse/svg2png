const gulp = require("gulp");
const babel = require("gulp-babel");
const { watch } = require('gulp')

const
    es6Files = "js/*.es6",
    jsDest = "js";

const es6 = cb => {
    gulp.src(es6Files)
        .pipe(babel({presets: ['@babel/preset-env']}))
        .pipe(gulp.dest(jsDest))
    cb()
}

gulp.task('es6', async () => es6)

exports.default = function() {
    watch(es6Files, es6)
}