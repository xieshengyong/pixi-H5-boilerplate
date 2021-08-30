/*
 * @Author: xieshengyong
 * @Date: 2019-06-18 11:35:03
 * @Last Modified by: xieshengyong
 * @Last Modified time: 2019-09-23 17:24:54
 */
/* eslint-disable no-unused-vars */

const fontCut = require('./DevToolScript/gulp-fontCut.js');
const audio = require('./DevToolScript/gulp-audiosprite.js');
const utf2gbk = require('./DevToolScript/gulp-utf2gbk.js');

const {
    series,
    parallel,
    src,
    dest,
    watch,
    done
} = require('gulp');

var rename = require('gulp-rename');
var del = require('del');
var minimist = require('minimist');
var vinylPaths = require('vinyl-paths');
var changed = require('gulp-changed');
var gulpIf = require('gulp-if');
var deleteEmpty = require('delete-empty');

var options = minimist(process.argv.slice(2));
// var Dir = config[options.d || 'dist'];

let outputDir = './a20190826anniversary/';

exports.fontCut = fontCut;
exports.audio = audio;
exports.gbk = utf2gbk;

// 清理文件夹
var clean = function () {
    return del([outputDir + '**/*.*']);
};
exports.clean = clean;

// 复制资源
var copy = series(clean, series(function () {
    return src('./dist/**/*.*')
            .pipe(dest(outputDir));
}, function () {
    return src([
        './build/web-mobile/**',
        '!./build/web-mobile/style-desktop**.css',
        '!./build/web-mobile/style-mobile**.css',
        '!./build/web-mobile/main**.js',
        '!./build/web-mobile/splash**.png',
        '!./build/web-mobile/index.html'
    ], {
        base: './build/web-mobile/'
    })
        .pipe(dest(outputDir + 'ossweb-img'));
}));
exports.copy = copy;

// 替换html内路径
var replaceHtml = function () {
    return src('dist/index.html')
        .pipe(replace(/\.\//g, Dir))
        .pipe(dest(outputDir));
};
exports.replaceHtml = replaceHtml;

const copyjscss = series(
    function () {
        return src(outputDir + 'index.html')
            .pipe(replace(Dir, './js/'))
            .pipe(dest(outputDir));
    },
    function () {
        return src(outputDir + 'index.html')
            .pipe(replace('./js/main.css', './css/main.css'))
            .pipe(dest(outputDir));
    },
    function () {
        return src(outputDir + 'ossweb-img/' + 'game**.js')
            .pipe(vinylPaths(del))
            .pipe(replace(Dir + 'src/', './js/'))
            .pipe(dest(outputDir + 'js/'));
    },
    function () {
        return src([
            outputDir + 'ossweb-img/' + 'cocos2d-js-min**.js',
            outputDir + 'ossweb-img/' + 'main**.js',
            outputDir + 'ossweb-img/' + 'src/project**.js',
            outputDir + 'ossweb-img/' + 'src/settings**.js'
        ])
        .pipe(vinylPaths(del))
        .pipe(dest(outputDir + 'js/'));
    }, function () {
        return src([
            outputDir + 'ossweb-img/' + 'src/assets/script/utils/howler.min**.js'
        ])
        .pipe(vinylPaths(del))
        .pipe(dest(outputDir + 'js/assets/script/utils/'));
    }, function () {
        return src([
            outputDir + 'ossweb-img/' + 'main**.css'
        ])
        .pipe(vinylPaths(del))
        .pipe(dest(outputDir + 'css/'));
    });
exports.copyjscss = copyjscss;

// 替换game.js内路径
var replaceMain = function () {
    return src('change/game.js')
        .pipe(replace(/res\//g, Dir + 'res/'))
        .pipe(replace(/'src\//g, "'" + Dir + 'src/'))
        .pipe(dest(outputDir + 'ossweb-img/'));
};
exports.replaceMain = replaceMain;

const isMd5 = (file) => {
    if (options.md5) {
        return md5(5, file);
    } else {
        return replace();
    }
};

// md5
var mdbuild = series(function () {
    return src(outputDir + 'ossweb-img/src/project.**js')
            .pipe(vinylPaths(del))
            .pipe(rename('project.js'))
            .pipe(isMd5(outputDir + 'ossweb-img/game.js'))
            .pipe(dest(outputDir + 'ossweb-img/src'))
            ;
}, function () {
    return src(outputDir + 'ossweb-img/cocos2d-js-min.**js')
            .pipe(vinylPaths(del))
            .pipe(rename('cocos2d-js-min.js'))
            .pipe(isMd5(outputDir + 'index.html'))
            .pipe(dest(outputDir + 'ossweb-img'));
}, function () {
    return src(outputDir + 'ossweb-img/src/settings.**js')
            .pipe(vinylPaths(del))
            .pipe(rename('settings.js'))
            .pipe(isMd5(outputDir + 'index.html'))
            .pipe(dest(outputDir + 'ossweb-img/src'));
}, function () {
    return src(outputDir + 'ossweb-img/game.js')
            .pipe(vinylPaths(del))
            .pipe(isMd5(outputDir + 'index.html'))
            .pipe(dest(outputDir + 'ossweb-img'));
});
exports.mdbuild = mdbuild;

// 对比
var marked = series(() => {
    return del(['aHasChangedFiles/**']);
}, () => {
    return src(['dist/**'], {
        base: outputDir
    })
    .pipe(gulpIf(f => !f.isDirectory(), changed('aBuildHistory/0lastBuild/', {hasChanged: changed.compareContents})))
    .pipe(dest('aHasChangedFiles/'));
}/* , () => {
    src('aBuildHistory/0lastBuild/**')
        .pipe(dest('aBuildHistory/' + Date.now()));
    return del('aBuildHistory/0lastBuild');
}, () => {
    return src('dist/**', {
        base: outputDir
    })
    .pipe(dest('aBuildHistory/0lastBuild'));
}, () => {
    return new Promise((resolve, reject) => {
        deleteEmpty('aHasChangedFiles/').then(resolve);
    });
} */);
exports.marked = marked;

exports.time = () => {
    // console.log(new Date().getTime());
    // console.log(Date.now());
    src('aBuildHistory/0lastBuild/**')
    .pipe(dest('aBuildHistory/' + Date.now()));
    // console.log(1);
};

exports.build = series(copy, replaceHtml, replaceMain, mdbuild);
