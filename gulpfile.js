const gulp = require('gulp');

//concat the js files in one
var concat = require('gulp-concat');

function unifyJs(){
    return gulp.src('./js/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./minimizejs'));
}

gulp.task("unifyJs", unifyJs);

//Minimize the images and save in minimized_images
const imagemin = require('gulp-imagemin');

function imgSquash() {
    return gulp .src("./images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./minimized_images"));
    }

gulp.task("imgSquash", imgSquash);

//Watching tasks

gulp.task("watch", () => {
    gulp.watch("./images/*", imgSquash);
    gulp.watch('./js/*.js', unifyJs);
    });

gulp.task("default",gulp.series("unifyJs", "imgSquash","watch"));