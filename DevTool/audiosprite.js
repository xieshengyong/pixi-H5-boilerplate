/* eslint-disable no-unused-vars */
/*
 * @Author: xieshengyong
 * @Date: 2021-07-08 17:32:13
 * @LastEditTime: 2021-07-08 18:57:08
 * @LastEditors: xieshengyong
 */

/**
 * 运行方式：
 *  gulp audio --fn=audio
 *  audio对应fns上所声明的函数
 */

const {
    series,
    parallel,
    src,
    dest,
    watch,
    done
} = require('gulp');

var audiosprite = require('gulp-audiosprite');
var vinylPaths = require('vinyl-paths');
var minimist = require('minimist');

var options = minimist(process.argv.slice(2));
let fns = {};

let audioExport = './src/media/';
fns.audio = series(() => {
    return src('./src/media/vo/*.*')
        .pipe(audiosprite({
            output: 'talkSound',
            format: 'howler',
            export: 'mp3',
            path: '.',
            bitrate: '96',
            gap: 0.5
        }))
        .pipe(dest(audioExport));
}, function () {
    return src(audioExport + 'talkSound.json')
        .pipe(vinylPaths(del))
        .pipe(dest('./src/json/'));
});

fns.audiovo2 = series(() => {
    return src('./src/media/vo2/*.*')
        .pipe(audiosprite({
            output: 'talkSound2',
            format: 'howler',
            export: 'mp3',
            path: '.',
            bitrate: '96',
            gap: 0.5
        }))
        .pipe(dest(audioExport));
}, function () {
    return src(audioExport + 'talkSound2.json')
        .pipe(vinylPaths(del))
        .pipe(dest('./src/json/'));
});

fns.audio2 = series(() => {
    return src('./src/media/effect/*.mp3')
        .pipe(audiosprite({
            output: 'effect',
            format: 'howler',
            export: 'mp3',
            path: '.',
            bitrate: '96'
        }))
        .pipe(dest(audioExport));
}, function () {
    return src(audioExport + 'effect.json')
        .pipe(vinylPaths(del))
        .pipe(dest('./src/json/'));
});

fns.audioZip = () => {
    return src('./src/media/bga.mp3')
        .pipe(audiosprite({
            output: 'bg',
            format: '',
            export: 'mp3',
            path: '.',
            bitrate: '96'
        }))
        .pipe(dest('./src/media/'));
};

const runFn = function () {
    fns[options.fn]();
};

module.exports = runFn;
