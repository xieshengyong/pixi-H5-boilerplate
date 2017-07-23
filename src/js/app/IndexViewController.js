var SceneInit = require('./common/SceneInit.js');
// var AnimatedSprite = require('./AnimatedSprite.js');

var IndexViewController = function (stage) {
    SceneInit.call(this, stage);

    this.init();
};

var fn = IndexViewController.prototype;

fn.init = function () {
    this.add([
        ['bg1.jpg', 0, 0],
        ['bg2.png', 5, 0],
        ['bg3.png', 0, 0]
    ]);
};

fn.hide = function () {
    var self = this;

    TweenLite.to(self.container, 0.3, {
        alpha: 0,
        onComplete: function () {
            self.onhide && self.onhide();
            self.container.visible = false;
            self.stage.removeChild(self.container);
        }
    });
};

module.exports = IndexViewController;
