/**
 * Created by deexiao on 2017/10/20.
 */
const
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	runSequence = require('run-sequence').use(gulp),
	exec = require('child_process').exec;

//启动服务器
gulp.task('server', function () {
	nodemonServerInit();
});

function nodemonServerInit() {
	$.livereload.listen();

	return $.nodemon({
		script: 'index.js',
		ext: 'js,ejs',
		ignore: [
			'client',
			'public',
			'test',
			'dist'
		]
	});
}
