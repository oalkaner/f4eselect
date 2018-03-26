/// <binding BeforeBuild='scripts' ProjectOpened='watch' />
// include plug-ins
console.log('Node version: ' + process.version);
var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var gutil = require('gulp-util');
var replace = require('gulp-replace');

var config = {
	//Include all js files but exclude any min.js files
	src: ['lib/*.js'],
    css : ['lib/*.css']
}

//delete the output file(s)
gulp.task('clean', function () {
	//del is an async function and not a gulp plugin (just standard nodejs)
	//It returns a promise, so make sure you return that from this task function
	//  so gulp knows when the delete is complete
	return del(['dist/*.*']);
});

// Combine and minify all files from the app folder
// This tasks depends on the clean task which means gulp will ensure that the 
// Clean task is completed before running the scripts task.
gulp.task('scripts', '', function () {

	return gulp.src(config.src)
	  .pipe(babel({
	  	presets: ['es2015']
	  }))
      .pipe(uglify({ mangle: true }))
	  .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
      .pipe(concat('f4e.select.min.js'))
      .pipe(gulp.dest('dist/'));
});

gulp.task('styles', '', function(){
    return gulp.src(config.css)
     .pipe(gulp.dest('dist/'));
});

//Set a default tasks

gulp.task('default', ['clean', 'styles', 'scripts'], function () { });
