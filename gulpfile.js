// sails dependencies
// npm install ejs rc sails sails-disk sails-mongo
// gulp dependencies 
// npm install event-stream gulp gulp-concat gulp-angular-templatecache gulp-ng-annotate gulp-uglify gulp-babel babel-preset-es2015 lodash gulp-sass gulp-livereload --save-dev
// bower install lodash moment codemirror angular angular-resource angular-animate angular-aria angular-messages angular-material  angular-ui-router angular-ui-codemirror 

var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var fs = require('fs');
var babel = require('gulp-babel')
var iife = require('gulp-iife')
var _ = require('lodash');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var gulpIf = require('gulp-if');

var sources = {
    app: {
        main: 'src/text-radio-switch.directive.js',
        src: [
            'src/text-radio-switch.directive.js',
            // 'src/app/app.js',
            // 'src/app/**/*module.js',
            // 'src/app/**/!(module)*.js'
        ],
        html: 'src/**/*.html',
        out: 'bundle.js',
    },
    sass: {
        main: 'src/text-radio-switch.directive.scss',
        src: [
            'src/**/*.scss',
        ]
    },
    css: [],
    assets: {
        src: [
            'src/**/*.**'
        ]
    },
    html: {
        main: 'src/index.html'
    }


};

var destinations = {
    dev: {
        root: "./dist",
        js: './dist',
        css: './dist',
        example: './example/dist',
        name: 'text-radio-switch.directive.js'
    },
    prod: {
        root: "./dist",
        js: './dist',
        css: './dist',
        example: './example',
        name: 'text-radio-switch.directive.min.js'
    },
};


function compile(appName, target) {
    var bundle = es.merge(
        gulp.src(sources[appName].src)
        , getTemplateStream(appName))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(iife({
            useStrict: false,
        }))
        .on('error', swallowError)
        .pipe(concat(destinations[target].name))
        .pipe(gulpIf(target == 'prod', ngAnnotate()))
        .pipe(gulpIf(target == 'prod', uglify()))

    return bundle.pipe(gulp.dest(destinations[target].js)).pipe(connect.reload());
}

gulp.task('compile-dev', compile.bind(this, 'app', 'dev'))
gulp.task('compile-prod', compile.bind(this, 'app', 'prod'))

gulp.task('watch', function () {
    gulp.watch(sources.sass.src, ['sass-dev']);
    gulp.watch(sources.app.src, ['compile-dev']);
    gulp.watch(sources.app.html, ['compile-dev']);
});


function compileSass(target) {
    return gulp.src(sources.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(destinations[target].css))
        .pipe(connect.reload());
}

gulp.task('sass-dev', compileSass.bind(this, 'dev'));
gulp.task('sass-prod', compileSass.bind(this, 'prod'));

gulp.task('sass-copy', function(){
    gulp.src(sources.sass.main)
        .pipe(gulp.dest(destinations.prod.root))
})


gulp.task('connect', function () {
    return connect.server({
        root: '.',
        port: 9082,
        livereload: true
    })
})


gulp.task('prod', ['sass-prod', 'compile-prod', 'sass-copy']);
gulp.task('dev', ['connect', 'sass-dev', 'compile-dev', 'watch']);
gulp.task('default', ['dev']);

var swallowError = function (error) {
    console.log(error.toString());
    this.emit('end')
};

var getTemplateStream = function (key) {
    return gulp.src(sources[key].html)
        .pipe(templateCache({
            root: 'app/',
            module: 'ng'
        }))
};
