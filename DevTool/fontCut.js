/* eslint-disable no-unused-vars */
/*
 * @Author: xieshengyong
 * @Date: 2021-07-08 15:26:43
 * @LastEditTime: 2021-07-08 18:13:03
 * @LastEditors: xieshengyong
 */
const fs = require('fs');

const {
    series,
    parallel,
    src,
    dest,
    watch,
    done
} = require('gulp');

var fontmin = require('gulp-fontmin');
var rename = require('gulp-rename');
var minimist = require('minimist');

var options = minimist(process.argv.slice(2));

// 默认扫描的文件夹
const pathPool = [
    './src/json/',
    './src/js/app/',
    './src/less/'
];

// 默认添加的文件，可新增单个文件
const filePool = [
    './index.ejs'
];

let Text = '';

pathPool.forEach(element => {
    let file = fs.readdirSync(element);
    file.forEach(ele => {
        ele.indexOf('.') > -1 && filePool.push(element + ele);
    });
});

filePool.forEach(file => {
    Text += fs.readFileSync(file);
});

const fontCut = () => {
    return src('src/font/Origin.ttf')
        .pipe(fontmin({
            text: Text
        }))
        .pipe(rename('font.ttf'))
        .pipe(dest('src/font/'));
};

module.exports = fontCut;
