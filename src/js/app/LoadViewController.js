var Imglist = require('./Imglist');

// 加载页对象
var LoadViewController = function () {};

var fn = LoadViewController.prototype;

fn.loadImg = function () {
    var self = this;
    
    PIXI.loader
            .add(this.formatImgList())
            .on('progress', this.loadingProgress.bind(this))
            .load(function (resource) {
                console.log('100%');
                self.hideScene();
            });
};

fn.formatImgList = function () {
    var list = [];
    for (var i = 0; i < Imglist.length; i++) {
        if (Imglist[i].indexOf('nopre_') >= 0) {
            continue;
        }
        list.push(this.path + Imglist[i]);
    }
    return list;
};

fn.loadingProgress = function (loader, resource) {
    // console.log(loader.progress);
};

fn.hideScene = function () {
    var self = this;
    TweenLite.to(self.container, 0.1, {
        alpha: 0,
        onComplete: function () {
            self.onhide && self.onhide();
            self.container.visible = false;
            self.stage.removeChild(self.container);
        }
    });
};

module.exports = LoadViewController;
