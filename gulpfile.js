/**
 * Created by deexiao on 2017/10/20.
 */
const
	gulp = require('gulp'),
	runSequence = require('run-sequence').use(gulp),
	exec = require('child_process').exec,
	$ = require('gulp-load-plugins')();

const paths = {
	name:'nodenotice2',
	release: 'archive/nodenotice2/',
	archive: 'archive/'
};

//删除发布后的文件夹
gulp.task('clean-release', function () {
	return gulp.src([paths.archive], {read: false})
		.pipe($.clean());
});

//拷贝后端Node文件
gulp.task('copy-server-side-files', function () {
	return gulp.src(['index.js', '.babelrc','package.json', 'src*/**'])
		.pipe(gulp.dest(paths.release));
});

//安装依赖
gulp.task('install-deps',function(cb){
	console.info('installing dependencies...');
	exec(`cd ${paths.release} && npm install --production`,function(err,stdout,stderr){
		if(err) throw err;
		if(stdout) console.info(stdout);
		if(stderr) console.info(stderr);
		cb();
	});
});

//打包需要发布的文件
gulp.task('package',function(){
	return gulp.src(`${paths.release}*/**`)
		.pipe($.tar(`${paths.name}.tar`))
		.pipe($.gzip())
		.pipe(gulp.dest(paths.archive));
});

gulp.task('release',function(){
	runSequence(
		'clean-release',
		'copy-server-side-files',
		'install-deps'
	);
});

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
