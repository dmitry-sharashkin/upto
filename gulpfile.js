//подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');


//порядок подключекния css файлов
const cssFiles = [
	'./src/css/vars.less',
	'./src/css/header.less',
	'./src/css/main.less',
	'./src/css/partnersship.less',
	'./src/css/presentation.less',
	'./src/css/process.less',
	'./src/css/start.less',
	'./src/css/team.less',
	'./src/css/tools.less',
	'./src/css/about.less',
	'./src/css/footer.less',
	'./src/css/media.less'
]
/*
//порядок подключекния css файлов
const cssFiles = [
	'./src/css/header.css',
	'./src/css/footer.css',
	'./src/css/media.css'
]
*/
//порядок подключекния js файлов
const jsFiles = [
	'./src/js/lib.js',
	'./src/js/main.js'
]




//таск на стили ССS
function styles(){
	//Шаблон для поиска файлов CSS
	//Все файлы по шаблону './src/css/**/*.css'
	return gulp.src(cssFiles)
	.pipe(sourcemaps.init())
	.pipe(less())
	//объединение файлов в один
	.pipe(concat('style.css'))
	//Добавить префиксы
	.pipe(autoprefixer({
		browsers:['last 2 versions'],
		cascade: false
	}))
	//
	.pipe(cleanCSS({
		level: 2
	}))
	.pipe(sourcemaps.write('./'))
	//Выходная папка для стилей
	.pipe(gulp.dest('./dist/css'))
	.pipe(browserSync.stream());
}


//таск на скрипты JS
function scripts(){
	//Шаблон для поиска файлов JS
	//Все файлы по шаблону './src/js/**/*.js'
	return gulp.src(jsFiles)
	//объединение файлов в один
	.pipe(concat('script.js'))
	//Сжатие Js
	// .pipe(uglify({
	// 	toplevel: false
	// }))
	//Выходная папка для скриптов
	.pipe(gulp.dest('./dist/js'))
	.pipe(browserSync.stream());

}
//удалить всё в папке dist
function clean(){
	return del(['dist/*'])
}

//Просматривать файлы
function watch(){
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	//Следить CSS за файлами
	gulp.watch('./src/css/**/*.less', styles)
	//Следить JS за файлами
	gulp.watch('./src/js/**/*.js', scripts)
	//При изменении html запустить синхронизацию
	gulp.watch("./*html").on('change', browserSync.reload);
}


//таск вызывающий функцию styles
gulp.task('styles', styles);
//таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//таск для очистки папки dist
gulp.task('del', clean);
//таск для отслеживания изменений
gulp.task('watch', watch);
//таск для удаления файлов в папке dist и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
//таск запускает build и watch последовательно
gulp.task('dev', gulp.series('build','watch'));
