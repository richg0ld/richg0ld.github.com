/**
 * Created by jhkim88 on 2016-04-08.
 */
module.exports = function(grunt) {

    // ['grunt-*', '@*/grunt-*'] 패턴과 일치하는 모든 그런트 작업을 로드 / 맨 아리줄에 "loadNpmTasks"로 일일히 다 로드 할 필요 없이 아래 줄 한방에 모두 로드 가능
    require('load-grunt-tasks')(grunt);

    // 작업시간 표시
    require('time-grunt')(grunt);

    // 가) 프로젝트 환경설정.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //html
        htmlhint: {//html 코드 문법 검사용
            options: {
                htmlhintrc: 'grunt/.htmlhintrc' // htmlhint에 사용되는 옵션과 규칙을 이 경로 파일에 넣어둠
            },
            dist: [// html 폴더의 모든 html파일과, include폴더의 모든 html파일을 옵션 설정 파일을 이용해 검사
                'app/docs/html/**/*.html',
                'app/docs/include/**/*.html'
            ]
        },
        includes: { //공통된 페이지를 분리 가능한 기능
            dist: {
                cwd: 'app/docs/html/', // 이 폴더를 기준으로 (루트 폴더 위치)
                src: ['**/*.html'], // 하위의 모든 폴더와 그폴더 밑 모든 html에 includeㄴ 플러그인을 실행
                dest: 'dist', // 목적지(dist)폴더에 생성함.
                options: {
                    flatten: true, // 이옵션을 true 로 하여 인클루드 경로를 사용
                    //debug: true,
                    includePtah: 'app/docs/include/' //인클루드 경로
                }
            }
        },
        //css
        less: {// css 를 만드는 작업
            dist: {
                // options: {
                //     banner: '<%= banner %>', //그런트에서 지원하는 변수 <%= banner %> 이용하여 css 상단에 배너를 추가
                //     dumpLineNumbers : 'comments' // less 파일의 몇번째 줄에 작업된 것이 css로 변경되었는지 코맨트가 달림.
                // },
                src: 'app/less/style.less', // less 파일 경로
                dest: 'app/css/style.css' // 목적지 경로, less 파일을 이경로의 여기 쓴 파일명으로 파일을 만듬 (dist 에는 바로 만들지 못하나봄.. 아직모르겠음)
            }
        },
        csslint: { //css 문법 검사
            options:{
                csslintrc: 'grunt/.csslintrc' // csslint에 사용되는 옵션과 규칙을 이 경로 파일에 넣어둠
            },
            dist: {
                src: '<%= less.dist.dest %>' // less.dist.dest 의 프로퍼티를 경로로 한다.
            }
        },
        autoprefixer: { // 크로스 브라우징에 맞게 각 브라우저에 밴더 삽입.
            options: {
                browsers: [ // 버전 등록
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            dist: { // app -> dest 이동 // 여기서 파일을 이동 시킴 위에꺼를 사용 안하더라도 이거때문에 오토프리픽서 사용.. 하나봄
                expand: true,
                cwd: 'app/css/',
                src: ['*.css',],
                dest: 'dist/css/'
            }
        },
        csscomb: { // && css 속성을 정렬해주는 모듈 (그냥 엔터로 줄바꿈같은거로 정렬 해주나봄 .. 생각보다쓸모 없을 꺼같음)
            options: {
                config: 'grunt/.csscomb.json'// 정렬 할 옵션이 정리되어있는 json 파일
            },
            dist: {
                src: 'dist/css/style.css', //대상 css파일 경로
                dest: 'dist/css/style.css' //작업후의 파일 목적지
            }
        },
        cssmin: { // css 파일 최소화
            options: {
                // compatibility: 'ie8',
                keepSpecialComments: 1,
                // default - '!'가 붙은 주석은 보존,
                // 1 - '!'가 붙은 주석 중 첫번째 주석만 보존
                // 0 - 모든 주석 제거
                // noAdvanced: true,
            },
            dist: {
                src: '<%= csscomb.dist.dest %>',
                dest: 'dist/css/style.min.css'
            }
        },
        //js
        jshint: { //자바스크립트 문법 검사
            options: {
                jshintrc: 'grunt/.jshintrc', //문법 검사용 옵션 파일
                force: true, // error 검출시 task를 fail 시키지 않고 계속 진단 (fail 되면 사용도못하니까..)
                reporter: require('jshint-stylish') // output을 수정 할 수 있는 옵션 ( jshint-stylish 요놈 깔아야 함 )
            },
            grunt: {
                src: ['Gruntfile.js'] //그런트인 Gruntfile.js 파일 문법검사
            },
            dist: {
                expand: true, //뭘까..?
                cwd: 'app/js/site', //루트 경로??
                src: ['*.js'], //경로안에 모든 파일
                dest: 'app/js/site' //도착지 (경로 바꿔도 그경로에 뭐가 생기지가 않음..나도 왜그런지 모름 )
            }
        },
        concat: { //여러개의 js 파일을 하나로 병합
            dist: {
                // options: {
                //     banner: '<%= banner %>'
                // },
                src: 'app/js/site/*.js', // js 파일들 경로
                dest: 'dist/js/common.js' // 병합한 파일 목적지
            }
        },
        uglify: { // js 파일 압축
            // options: {
            //     banner: '<%= banner %>'
            // },
            dist: {
                src: '<%= concat.dist.dest %>', //대상 경로
                dest: 'dist/js/common.min.js' //압축한 파일 목적지
            }
        },
        //other
        clean: {// 파일을 삭제 할 때 사용 (보통은 기존에 병합한 파일들을 지우고 다시 만드는 용으로 사용하나봄)
            dev: {
                files: [{
                    dot: true,
                    src: [
                        'dev/**/*',
                        'app/css'
                    ]
                }]
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'app/css',
                        'dist/**/*'
                    ]
                }]
            }
        },
        copy: { // 말그대로 파일들을 복사할 때 사용
            basic: { //기본적으로 복사 하는 것들
                files: [
                    // fonts
                    {// 폰트 파일 복사
                        expand: true,
                        cwd: 'app/fonts/',
                        src: '**',
                        dest: 'dist/fonts/'
                    },
                    // js
                    {// js 파일 복사 (보통은 제이쿼리나 이징 파일 처럼 라이브러리를 복사)
                        expand: true,
                        cwd: 'app/js/lib',
                        src: ['*.js'],
                        dest: 'dist/js/lib'
                    }
                ]
            },
            dev: { // 개발폴더를 위한 복사
                files: [
                    { // html folder
                        expand: true,
                        cwd: 'app/docs/html/',
                        src: '**',
                        dest: 'dev/'
                    },
                    { // include folder
                        expand: true,
                        cwd: 'app/docs/',
                        src: ['include/**/*'],
                        dest: 'dev/'
                    },
                    { // css
                        expand: true,
                        cwd: 'dist/css/',
                        src: '**',
                        dest: 'dev/css/'
                    },
                    { // js
                        expand: true,
                        cwd: 'dist/js/',
                        src: '**',
                        dest: 'dev/js/'
                    },
                    { // images
                        expand: true,
                        cwd: 'dist/images/',
                        src: '**',
                        dest: 'dev/images/'
                    },
                    { // fonts
                        expand: true,
                        cwd: 'dist/fonts/',
                        src: '**',
                        dest: 'dev/fonts/'
                    }
                ]
            }
        },
        imagemin: { //이미지 최적화 모드 ( 용량을 줄여주는 모드라고나 할까 )
            options: {
                title: 'Build complete',  // optional
                message: '<%= pkg.name %> build finished successfully.' //required
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/images/',
                    src: '**/*.{png,jpeg,jpg,gif}', // 객체 처럼 확장자명을 여러개 넣을 수 있다.
                    dest: 'dist/images/'
                }]
            }
        },
        //watch
        watch: { // 모듈 파일을 감시해서 실시간으로 재생산 하게끔 해주는 모듈... 잘은 모르지만 중요한 내용인거 같으니 다시 보도록하자
            options: {livereload: true},
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['newer:jshint:grunt'] //newer는 변경된 파일이나 부분만을 감지하는 모듈 watch 와 같이 주로 사용함.
            },
            js: {
                files: ['app/js/**/*.js'],
                tasks: ['newer:jshint:dist','concat','uglify']
            },
            less: {
                files: ['app/less/**/*.less'],
                tasks: ['less','csslint','autoprefixer','csscomb','concat']
            },
            img: {
                files: ['app/images/**/*.{gif,jpeg,jpg,png}'],
                tasks: ['newer:imagemin']
            },
            html: {
                files: ['app/docs/**/*.html'],
                tasks: ['htmlhint','includes']
            }
        },
        connect: { // 모듈 서버를 이용해서 브라우저로 파일을 열 수 있게끔 만들어 줌 .. 걍라이브서버처럼 브라우저를 바로 실행시킴
            server: {
                options: {
                    port: 9000, //포트
                    hostname: 'localhost', //주소
                    livereload: 35729,
                    // keepalive: true,
                    base: 'dist', // 베이스 목적지
                    open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/sub01/sub01_01.html' // 오픈 페이지 경로
                }
            }
        },
        concurrent: { // 병렬로 작업을 실행 하게끔 해줌 (막상 해보니 이게 더 느림)
            options: {
                logConcurrentOutput: true // 동시 진행 작업의 출력기록을 할지말지
            },
            dist: [
                'html',
                'css',
                'js',
                'newer:imagemin'
            ]
        },
    });

    ///////////////////////////////////// S : load-grunt-tasks 깔기 전 /////////////////////////////////////////////

    //각각 설치한 npm들을 테스크에 집어넣어 로드시킴
    // grunt.loadNpmTasks('grunt-htmlhint');
    // grunt.loadNpmTasks('grunt-includes');
    // grunt.loadNpmTasks('grunt-contrib-less');
    // grunt.loadNpmTasks('grunt-contrib-csslint');
    // grunt.loadNpmTasks('grunt-autoprefixer');
    // grunt.loadNpmTasks('grunt-csscomb');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-newer');
    // grunt.loadNpmTasks('grunt-contrib-connect');

    // grunt.loadNpmTasks('grunt-concurrent');
    
    //레지스트에 등록 ( grunt 명령어로 실행할 목록 등록)
    // grunt.registerTask('default', [
    //     // 'concurrent',
    //     'clean',// 이 배열에서도 순서대로 작동 하기 때문에 맨뒤에 clean 을 넣으면 마지막에 clean을 실행하여 폴더안에 아무것도 남지 않게 됨. (clean:dev 이렇게 쓰면 dev만 clean 되나봄)
    //     'htmlhint',
    //     'includes',
    //     'less',
    //     'csslint',
    //     'autoprefixer',
    //     'csscomb',
    //     'cssmin',
    //     'jshint',
    //     'concat',
    //     'uglify',
    //     'copy',
    //     'imagemin',
    //     'connect',
    //     'watch',
    //     'newer'
    // ]);

    // 나) task 실행.
    // 1. html task
    // 2. css task
    // 3. javascript task
    // 4. watch task
    // 5. build task
    // 6. default task
    
    ///////////////////////////////////// E : load-grunt-tasks 깔기 전 /////////////////////////////////////////////

    // grunt.registerTask('serve', function (target) {//watch 테스크 이다 분석을 해봅세
    //     if (target === 'dist') {
    //         return grunt.task.run(['connect', 'watch']);
    //     }
    //
    //     grunt.task.run([
    //         'default',
    //         'connect',
    //         'watch'
    //     ]);
    // });

    grunt.registerTask('html', [ //html 이란 테스크에 htmlhint, includes 를 묶는다 (실행시에는 default 에서 묶은 이름으로 불러야 한다.
        'htmlhint',
        'includes'
    ]);

    grunt.registerTask('css', [ //css 괁련 테스크 묶음
        'less',
        'csslint',
        'autoprefixer',
        'csscomb',
        'cssmin'
    ]);
    grunt.registerTask('js', [ //js 테스크 묶음
        'newer:jshint',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('default', [
        // 'clean:dist',
        // 'html', // 임의로 이름을 지은 테스크들을 로드
        // 'css',
        // 'js',
        // 'newer:imagemin'
        'concurrent',
        // 'copy:basic'
    ]);

    grunt.registerTask('build', [ // build 테스크 묶음
            'clean:dev',
            'concurrent',
            'copy'
        ]
    );
};