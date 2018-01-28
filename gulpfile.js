var gulp = require('gulp');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var connect = require('gulp-connect');
var order = require('gulp-order');
var concat = require('gulp-concat');
var log = require('gulp-util').log;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minCss = require('gulp-minify-css');
var minJs = require('gulp-uglify');
var bowerFiles = require('main-bower-files');
var gulpfilter = require('gulp-filter');
var openUrl = require('gulp-open');
var sequence = require('gulp-sequence');
var modrewrite = require('connect-modrewrite');
var modrewrite = require('connect-modrewrite');

var path = {};
path.dev = 'frontend/';
path.dest = 'public';
path.pug = path.dev + '/**/*.pug';
path.css = path.dev + '/**/*.scss';
path.js = path.dev + '/**/*.js';
path.assets = path.dev + '/files/**/*';

var config = {
	autoprefixer: {
		browsers: ['last 2 versions'],
		cascade: false
	},
	scssOrder: ['**/font.scss', 'styles.scss'],
	jsOrder: ['**/app.js', '**/appConfig.js'],
	modrewrite: [
		'^/api/(.*)$ http://localhost:8081/api/$1 [P]'
	],
	port: 9000
};

gulp.task('compile-pug', function() {
	return gulp.src(path.pug)
		.pipe( plumber() )
		.pipe( pug() )
		.on('error', log)
		.pipe( gulp.dest(path.dest) )
		.pipe( connect.reload() )
});

//  compile app.css file (default readable, --prod to minify)
gulp.task('app-css', function () {
	return gulp.src(path.css)
		.pipe( order(config.scssOrder) )
		.pipe( concat('app.css') )
		.pipe( plumber() )
		.pipe( sass() )
		.pipe( autoprefixer(config.autoprefixer) )
		// .pipe( minCss() )
		.on('error', log )
		.pipe( gulp.dest(path.dest) )
		.pipe( connect.reload() );
});

//  compile app.js file (default readable, --prod to minify)
gulp.task('app-js', function () {
	return gulp.src(path.js)
		.pipe( plumber() )
		.pipe( order(config.jsOrder) )
		.pipe( concat('app.js') )
		// .pipe( minJs() )
		.on( 'error', log )
		.pipe( gulp.dest(path.dest) )
		.pipe( connect.reload() );
});

//  compile lib.js file from bower_components (default readable, --prod to minify)
gulp.task('lib-js', function () {
	var filter = gulpfilter(['**/**.js']);

	return gulp.src(bowerFiles())
		.pipe(filter)
		.pipe( plumber() )
		.pipe( concat('libs.js') )
		.on('error', log )
		.pipe( gulp.dest(path.dest) );
});

//  compile lib.css file from bower_components (default min)
gulp.task('lib-css', function () {
	var filter = gulpfilter(['**/**.css']);

	return gulp.src(bowerFiles())
		.pipe(filter)
		.pipe( plumber() )
		.pipe( concat('libs.css') )
		.on('error', log )
		.pipe( gulp.dest(path.dest) );
});

//  copy font files, image files, etc.
gulp.task('assets', function () {
	return gulp.src(path.assets)
		.pipe( gulp.dest(path.dest + '/files') );
});

// Dev tasks
gulp.task('server', function() {
	return connect.server({
		root: path.dest,
		port: config.port,
		livereload: true,
		middleware: function(connect, o) {
			return [
				modrewrite(config.modrewrite)
			];
		}
	});
});

gulp.task('watch', function() {
	gulp.watch(path.js, ['app-js']);
	gulp.watch(path.pug, ['compile-pug']);
	gulp.watch(path.css, ['app-css']);
	return gulp.watch(path.assets, ['assets']);
});

gulp.task('openUrl', function() {
	return gulp.src(__filename)
		.pipe( openUrl({uri: 'http://localhost:' + config.port}) );
});

gulp.task('clean', function() {
	return gulp.src(path.dest, {read: false})
		.pipe(clean());
});

// --------------------------------------------------

var buildTasks = ['assets', 'compile-pug', 'app-js', 'lib-js', 'app-css', 'lib-css'];

gulp.task('build', function() {
	return sequence(['clean'], buildTasks, function () {
			return log(' -| Builded');
		}
	);
});

gulp.task('dev', function() {
	return sequence(['clean'], buildTasks, ['server', 'watch'], 'openUrl', function() {
		return log(' -| Runned');
	});
});