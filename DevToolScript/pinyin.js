/*
 * @Author: xieshengyong
 * @Date: 2021-08-11 14:37:32
 * @LastEditTime: 2021-09-09 01:06:49
 * @LastEditors: xieshengyong
 */
const fs = require('fs');
// const path = require('path');
const pinyin = require('pinyin');

// const args = process.argv.slice(2);

let mypath = './temp/icon/';
const items = fs.readdirSync(mypath);

let table = {};

items.map(item => {
    // fs.readdirSync(mypath + item).map((ele, idx) => {
    //     if (idx % 2 === 0) {
    //         fs.unlinkSync(mypath + item + '/' + ele);
    //     }
    // });
    // fs.readdirSync(mypath + item).map((ele, idx) => {
    //     fs.renameSync(mypath + item + '/' + ele, mypath + item + '/' + item + '_' + idx + '.png');
    // });
    // console.log(item);
    let pinyinNames = pinyin(item, { style: pinyin.STYLE_FIRST_LETTER });
    // pinyinNames.splice(pinyinNames.length - 1, 0, ['_']);
    let fileName = pinyinNames.join('');
    table[item] = fileName;
    fs.renameSync(mypath + item, mypath + fileName);
});
console.log(table);
