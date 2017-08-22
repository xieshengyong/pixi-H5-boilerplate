// var SceneInit = require('./pixi-module/SceneInit.js');
// var AnimatedSprite = require('./AnimatedSprite.js');

var IndexViewController = function () {
    // console.log(this.add);
    // this.init();
};

var fn = IndexViewController.prototype;

fn.init = function () {
    this.add([
        ['man1_9.png', 0, 0],
        ['man1_10.png', 100, 0],
        ['man1_11.png', 200, 0]
    ]);

    this.get(['man1_11', 'man1_10', 'man1_9']).show(function () {
        this.to(1, {x: '+=100'}).to(1, {x: '-=100', delay: 1});
    }).centerCtn(this.screen);
};


fn.hideScene = function () {
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
