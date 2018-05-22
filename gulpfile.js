var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('server',function(){
    nodemon({
        'script': '.',
    });
});

gulp.task('serve', ['server']);
