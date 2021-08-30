/* eslint-disable no-unused-vars */
/*
 * @Author: xieshengyong
 * @Date: 2021-07-08 18:58:26
 * @LastEditTime: 2021-07-08 20:27:01
 * @LastEditors: xieshengyong
 */

const {
    series,
    parallel,
    src,
    dest,
    watch,
    done
} = require('gulp');

var convertEncoding = require('gulp-convert-encoding');
var replace = require('gulp-replace');

let outputDir = './dist/';

const gbk = () => {
    return src([outputDir + '**/*.html', outputDir + '**/*.json', outputDir + '**/*.js'])
        .pipe(replace(/utf-8/g, 'gbk'))
        .pipe(convertEncoding({
            from: 'utf8',
            to: 'gbk'
        }))
        .pipe(dest(outputDir + ''));
};

module.exports = gbk;
