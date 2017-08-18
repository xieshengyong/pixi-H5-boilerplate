var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');
var less = require('gulp-less');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var plumer = require('gulp-plumber');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var browsersync = require('browser-sync').create();
var path = require('path');
var header = require('gulp-header');

var lessSrc = './src/less/**/style.less';
var lessDict = 'src/less/**/*.less';
var imageSrc = 'src/img/**/*.*';
var media = 'src/media/**/*.*';
var jsSrc = 'src/js/**/*.*';

var distPath = './dist/';

// var txpath = 'http://shzjh.treedom.cn/handover/';
var txpath = '//game.gtimg.cn/images/lol/m/act/a20170717lolmusic/';
var cssExport = 'handover/';
var jsexport = 'handover/';
var imgExport = 'handover/ossweb-img/';

// 编译less
gulp.task('less', function () {
    return gulp.src(lessSrc)
        .pipe(plumer())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest(distPath + 'css/'));
});

// 复制图片
gulp.task('images', ['imagesList'], function () {
    return gulp.src(imageSrc)
        .pipe(rename({dirname: '.'}))
        .pipe(gulp.dest(distPath + 'img/'));
});

// 生成图片文件名集合
gulp.task('imagesList', function () {
    return gulp.src('src/img/*.*')
        .pipe(rev())
        .pipe(rev.manifest('Imglist.js'))
        .pipe(replace(/: ".+"/g, ''))
        .pipe(replace(/"/g, "'"))
        .pipe(replace(/  /g, '    '))
        .pipe(replace(/{/g, 'var Imglist = ['))
        .pipe(replace(/}/g, '];\nmodule.exports = Imglist;\n'))
        .pipe(gulp.dest('src/js/app/'));
});

// 复制media
gulp.task('media', function () {
    return gulp.src(media)
        .pipe(rename({dirname: '.'}))
        .pipe(gulp.dest(distPath + 'img/'));
});

// webpack打包
gulp.task('webpack', function (callback) {
    var myConfig = Object.create(webpackConfig);

    myConfig.output.filename = distPath + 'js/main.js';

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
        }));
        callback();
    });
});

// 压缩less
gulp.task('lessmin', function () {
    return gulp.src(lessSrc)
        .pipe(replace(/\/dist\/img\//g, txpath))
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(cssExport));
});

gulp.task('rhtml', function () {
    return gulp.src('index.html')
        .pipe(replace(/"dist\/css\//g, '"' + txpath))
        .pipe(replace(/"dist\/js\//g, '"' + txpath))
        .pipe(gulp.dest('handover/'));
});

gulp.task('rjs', ['webpack:build'], function () {
    return gulp.src(jsexport + 'main.js')
        .pipe(replace(/imgPath="dist\/img\//g, 'imgPath="' + txpath))
        .pipe(gulp.dest(jsexport));
});

gulp.task('rimages', function () {
    return gulp.src(imageSrc)
        .pipe(rename({dirname: '.'}))
        .pipe(gulp.dest(imgExport));
});

gulp.task('rmedia', function () {
    return gulp.src(media)
        .pipe(rename({dirname: '.'}))
        .pipe(gulp.dest(imgExport));
});

gulp.task('rhead', ['rjs'], function () {
    // using data from package.json
    var pkg = require('./package.json');
    var banner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v<%= pkg.version %>',
        ' * @author <%= pkg.author %>',
        ' */',
        ''].join('\n');

    return gulp.src(jsexport + 'main.js')
          .pipe(header(banner, {pkg: pkg}))
          .pipe(gulp.dest(jsexport));
});

// 压缩js
gulp.task('webpack:build', function (callback) {
    var myConfig = Object.create(webpackConfig);

    myConfig.plugins = myConfig.plugins.concat(
        new webpack.optimize.UglifyJsPlugin()
    );

    // 过滤任意函数插件
    // myConfig.module.loaders.push({text: /\.js$/, loader: 'webpack-strip?strip[]=TD.debug'});

    myConfig.output.filename = jsexport + 'main.js';

    myConfig.module.loaders[0] = {test: /js[\/|\\]lib[\/||\\][\w|\.|_|-]+js$/, loader: 'url-loader?importLoaders=1&limit=1000&name=' + jsexport + '[name].[ext]'};

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({}));

        callback();
    });
});

// browsersync自动刷新
gulp.task('browsersync', function () {
    browsersync.init({
        open: 'external',
        server: {
            baseDir: './'
        },
        // port: 80,
        files: ['./dist/img/*.*', './dist/css/*.*', './dist/js/*.*', './*.html']
    });
});

// 清理dist/img文件夹，避免重复文件
gulp.task('cleanImg', function (cb) {
    del([
        distPath
    ], cb);
});

// 默认侦听
gulp.task('default', ['images', 'less', 'webpack', 'media'], function () {
    gulp.watch(imageSrc, ['images']);

    gulp.watch(lessDict, ['less']);

    gulp.watch(jsSrc, ['webpack']);

    gulp.watch(media, ['media']);
});

// 自动刷新
gulp.task('sync', ['images', 'less', 'webpack', 'media', 'browsersync'], function () {
    gulp.watch(imageSrc, ['images']);

    gulp.watch(lessDict, ['less']);

    gulp.watch(jsSrc, ['webpack']);

    gulp.watch(media, ['media']);
});

// 压缩
gulp.task('zip', ['lessmin', 'rhtml', 'rimages', 'rmedia', 'rhead']);
