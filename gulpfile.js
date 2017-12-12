const gulp = require("gulp");
const babel = require("gulp-babel");

const
    es6Files = "js/*.es6",
    jsDest = "js";

gulp.task("es6", () => gulp.src(es6Files)
    .pipe(babel())
    .pipe(gulp.dest(jsDest)));

gulp.task("watch", () => {
    gulp.watch(es6Files, ["es6"]);
});