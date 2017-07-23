var Config = require('./Config');
var Imglist = require('./Imglist');

// 加载页对象
var LoadViewController = function (stage) {
    this.stage = stage;
    this.imgPath = Config.imgPath;

    this.container = new PIXI.Container();
    this.stage.addChild(this.container);

    this.loadImg();
};

var fn = LoadViewController.prototype;

fn.formatImgList = function () {
    var list = [];
    for (var i = 0; i < Imglist.length; i++) {
        if (Imglist[i].indexOf('nopre_') >= 0) {
            continue;
        }
        list.push(this.imgPath + Imglist[i]);
    }
    return list;
};

fn.loadImg = function () {
    var self = this;
    PIXI.loader
            .add(this.formatImgList())
            .on('progress', this.loadingProgress.bind(this))
            .load(function () {
                self.hide();
            });
};

fn.loadingProgress = function (loader, resource) {
    console.log(loader.progress);
};

fn.hide = function () {
    var self = this;
    TweenLite.to(self.container, 0.1, {
        alpha: 0,
        onComplete: function () {
            self.onhide && self.onhide();
            self.container.visible = false;
            // self.container.destroy(true);
            self.stage.removeChild(self.container);
        }
    });
};

module.exports = LoadViewController;
