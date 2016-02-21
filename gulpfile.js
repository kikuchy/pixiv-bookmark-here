'use strict';

var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var zip = require('gulp-zip');
var debug = require('gulp-debug');
var merge = require('merge-stream');
var run = require('gulp-run');
var rename = require("gulp-rename");

// 一時ファイルを削除
gulp.task('clean', function (cb) {
    return del([
        'dest/**'
    ], cb);
});

// gulp.task('watch', ['build'], function () {
//     gulp.watch('src/**/*.purs', ['']);
// });

// Extensionに含めるファイル群をコピー
gulp.task('build', ['clean'], function () {
    return merge(
        gulp.src(['manifest.json']).pipe(
            gulp.dest('dest/')
        ),
        run('pulp browserify -O').exec().pipe(rename(function (path) {
            path.basename = "index.js";
            return path;
        })).pipe(
            gulp.dest('dest/')
        )
    );
});

gulp.task('distribute', ['build'], function () {
    var manifest = require('./manifest.json');
    return gulp.src('dest/**/*')
        .pipe(zip(manifest.name + '_' + manifest.version + '.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
    return gulp.start('build');
});
