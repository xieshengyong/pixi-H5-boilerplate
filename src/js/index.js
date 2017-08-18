/*
    可按需加载模块
*/
require('zepto');
require('pixi');
// require('./lib/PituBridge-1.2.js');
require('./app/module/TweenLite.min.js');
require('./app/module/EasePack.min.js');
// require('./app/module/howler.core.js');

/*
    可按需加载Zepto模块
*/
require('./app/module/fx'); // 以动画形式的 show, hide, toggle, 和 fade*()方法.依赖fx模块。
require('./app/module/fx_methods'); // 以动画形式的 show, hide, toggle, 和 fade*()方法.依赖fx模块。

// 引入的包根据实际情况而定
var NewScene = require('./app/pixi-module/NewScene.js');
var LoadViewController = require('./app/LoadViewController.js');
var IndexViewController = require('./app/IndexViewController.js');

var Main = function () {
    this.loadPageBack();
};

var fn = Main.prototype;

fn.loadPageBack = function () {
    this.loadView = this.loadView || NewScene(LoadViewController);
    this.loadView.onhide = this.indexPageBack.bind(this);
    this.loadView.loadImg();
};

fn.indexPageBack = function () {
    this.indexView = this.indexView || NewScene(IndexViewController);
    this.indexView.init();
    // this.indexView.onhide = this.imgPageBack.bind(this);
};

new Main(); // eslint-disable-line no-new
