const gulp = require('gulp')
const spawn = require('child_process').spawn
const gutil = require('gulp-util')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const copy = require('gulp-copy')
const del = require('del')
const eslint = require('gulp-eslint')
const nodemon = require('gulp-nodemon')
const friendlyFormatter = require('eslint-friendly-formatter')

var node
var src = './src'
var dist = './dist'

gulp.task('clean', function () {
    return del(`${dist}/*`)
})

// -----------------------------------------------------------------------------
gulp.task('lint', () => {
    return gulp.src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format(friendlyFormatter))
})

gulp.task('copy-resources', function () {
    return gulp.src(src + '/**/*.json')
        .pipe(gulp.dest(dist))
})

gulp.task('build', ['copy-resources'], function () {
    return gulp.src(src + '/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('./', {
            sourceRoot: '../' + src
        }))
        .pipe(gulp.dest(dist))
})


gulp.task('server', function () {
    if (node) {
        gutil.log('$gulp kill node')
        node.kill()
    }
    node = spawn('node', ['--harmony', dist + '/app.js'], {
        stdio: 'inherit'
    })
    node.on('close', function (code) {
        if (code === 8) {
            gutil.log('Error detected, waiting for changes...')
        }
    })
})

// -----------------------------------------------------------------------------
gulp.task('watch', ['lint', 'build'], function () {
    return nodemon({
        script: `${dist}/app.js`,
        watch: src,
        tasks: ['lint', 'build']
    })
})


// -----------------------------------------------------------------------------
// local test with nodemon
gulp.task('dev', ['clean', 'watch'])

// -----------------------------------------------------------------------------
// default task
gulp.task('default', ['clean', 'watch'])

process.on('exit', function () {
    if (node) node.kill()
})
