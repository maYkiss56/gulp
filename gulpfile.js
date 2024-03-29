const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const contat = require('gulp-concat');
const rename = require('gulp-rename');


// обновление html
gulp.task('html', function() {
	return gulp.src('app/*.html')
		.pipe(browserSync.reload({stream: true}))
})


// конвертация файлов scss в css
gulp.task('scss', function() {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});


// обновление js файлов
gulp.task('script', function() {
	return gulp.src('app/js/*.js')
		.pipe(browserSync.reload({stream: true}))
})


gulp.task('js', function() {
	return gulp.src([
		'node_modules/slick-carousel/slick/slick.js',
		'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
	])
	.pipe(contat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}))
});


// автоматическое обновление браузера
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		}
	});
});


// автоматическая конвертация
gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
	gulp.watch('app/*.html', gulp.parallel('html'));
	gulp.watch('app/js/*.js', gulp.parallel('script'));
});


// дефолтный таск
gulp.task('default', gulp.parallel('scss', 'js' ,'browser-sync', 'watch'));