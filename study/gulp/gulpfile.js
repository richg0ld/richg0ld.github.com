/**
 * Created by jhkim88 on 2016-04-12.
 */

//npm를 사용하겠다는 것 같음
var gulp = require('gulp'); 
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');

var webserver = require('gulp-webserver');

var open = require('gulp-open');

var clean = require('gulp-clean');

// 작업 경로 설정
var devSrc = 'src/dev';
var devPaths = {
    js: devSrc + '/js/**/*.js',
    css: devSrc + '/css/**/*.scss',
    html: devSrc + '/html/**/*.*'
};

// 결과물 경로 설정
var buildSrc = 'src/Build';

// gulp task를 사용하여 task를 추가한다. 예) gulp.task('테스크명', function (){ return  })
gulp.task('js', function(){ // 테스크 명 과 실행할 함수를 인자로 갖는다.
    return gulp.src(devPaths.js).  // 하나로 만들 파일 경로(참고로 return 값을 리턴 받았다는걸 명심하자)
    pipe(concat('result.js')). //result.js 파일 하나로 병합
    pipe(uglify()). // 그 파일을 min화 시킴
    pipe(gulp.dest(buildSrc + '/js')); //도착지 설정
});

gulp.task('css', function () {
    return gulp.src(devPaths.css).
    pipe(concat('result.css')).
    pipe(sass()).
    pipe(minifyCss()).
    pipe(gulp.dest(buildSrc + '/css'));
});

gulp.task('html', function(){
    return gulp.src(devPaths.html).
    pipe(gulp.dest(buildSrc + '/html'));
});

// gulp.task('server', function(){
//     return gulp.src(buildSrc + '/').
//     pipe(webserver()); // 그냥 기본 서버 시작 ( 마치 http-server 같은 기능?...)
// });

// gulp.task('open', function(){
//     var options = {
//         uri: 'http://localhost:8000/html/index.html', // url 유알엘이 아니라 유알아이다.. 왜지?
//         app: 'chrome'
//     };
//     gulp.src(buildSrc + '/').
//     pipe(open(options));
// });

// 파일 변경 감지 devPaths.js, devPaths.css, devPaths.html 해당 경로의 파일들의 수정이 일어나면 해당 테스크가 실행된다.
// 예를들어 devPaths.js에 속한 src/dev/js/js1.js가 수정이 되면 "js" Task를 실행한다.
gulp.task('watch', function () { // watch 기능은 그런트에서는 깔아줘야 하는데 걸프는 자체적으로 있나보다
    gulp.watch(devPaths.js, ['js']);
    gulp.watch(devPaths.css, ['css']);
    gulp.watch(devPaths.html, ['html']);
});

// livereload 작업 방법은 간단하다.
// 아까 작성했던 server의 내용에서 webserver()부분을 다음과 같이 수정하면 된다.
// 이 과정에서 기존에 생성했던 “open” Task를 삭제하고 server의 내용에 합쳤고, “server” Task를 실행할때 “watch” Task도 같이 실행 되도록 수정했다.
// (여기서는 “server” Task작동시 “watch” Task가 같이 실행하는 방법을 미리 살짝 봤다.)
gulp.task('server', ['watch'], function(){ //배열부분이 실제 이곧의 테스크 가 작동할 시 같이 작동되는 테스크 명 인것 같다.
    var options = {// open 에 있던 option 객체
        uri: 'http://localhost:8000/html/index.html',
        app: 'chrome'
    };
    return gulp.src(buildSrc + '/'). //root 경로
    pipe(webserver({
        livereload : true //livereload 사용
    })).
    pipe(open(options)); //서버 실행
});

gulp.task('clean', function () { //빌드된 폴더 지우기
    return gulp.src(buildSrc, {
        read: false
    }).
    pipe(clean());
});

gulp.task('compile', ['js', 'css', 'html'], function(){ //모든걸 한번에 컴파일 하는 테스크
    gulp.start('server');
});

gulp.task('default', ['clean'],function(){ //먼저 clean을 실행하고 끝난 후 compile 테스크 실행
    gulp.start('compile');
});

// gulp.task(name, [Task배열], 함수]);
//배열 안에 있는 테스크들은 현재 테스크가 실행되기전에 실행되며, 완료가 된 시점에 현재 테스크의 작업이 실행된다.