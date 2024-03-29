const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const contat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');


// обновление html
gulp.task('html', function() {
	return gulp.src('app/*.html')
		.pipe(browserSync.reload({stream: true}))
})


// конвертация файлов scss в css
gulp.task('scss', function() {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 8 versions']
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});


gulp.task('css', function() {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/slick-carousel/slick/slick.css',
		'node_modules/magnific-popup/dist/magnific-popup.css'
	])
	.pipe(contat('_libs.scss'))
	.pipe(gulp.dest('app/scss'))
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


// на продакшин
gulp.task('export', async function() {
	const buildHtml = gulp.src('app/**/*.html')
		.pipe(gulp.dest('dist'))

	const buildCss = gulp.src('app/css/**/*.css')
		.pipe(gulp.dest('dist/css'))

	const buildJs = gulp.src('app/js/**/*.js')
		.pipe(gulp.dest('dist/js'))

	const buildFonts = gulp.src('app/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'))

	const buildImg = gulp.src('app/img/**/*.*')
		.pipe(gulp.dest('dist/img'))
});


gulp.task('clean', async function() {
	del.sync('dist')
});


// автоматическая конвертация
gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
	gulp.watch('app/*.html', gulp.parallel('html'));
	gulp.watch('app/js/*.js', gulp.parallel('script'));
});

// del & build => вместе
gulp.task('build', gulp.series('clean', 'export'));

// дефолтный таск
gulp.task('default', gulp.parallel('css', 'scss', 'js' ,'browser-sync', 'watch'));