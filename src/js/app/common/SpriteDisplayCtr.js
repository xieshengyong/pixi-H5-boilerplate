var SpriteDisplayCtr = function (scene) {
    this.scene = scene || null;
};

var pro = SpriteDisplayCtr.prototype;

pro.hideSprite = function (sprite, duration, vars) {
    var dur = duration || 0;
    var vas = vars || {};
    if (duration === 0) {
        this.streetHide(this.prettySprite(sprite));
        return;
    }
    vas.visible = vas.visible || false;
    vas.alpha = vas.alpha || 0;
    TweenLite.to(this.prettySprite(sprite), dur, vas);
};

pro.streetHide = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].visible = false;
        arr[i].alpha = 0;
    }
};

pro.showSprite = function (sprite, dur, vars) {
    var duration = dur || 0;
    var vas = vars || {};
    if (duration === 0) {
        this.streetShow(this.prettySprite(sprite));
        return;
    }
    vas.visible = true;
    vas.alpha = vas.alpha || 1;
    TweenLite.to(this.prettySprite(sprite), duration, vas);
};

pro.streetShow = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].visible = true;
        arr[i].alpha = 1;
    }
};

pro.spriteCenter = function (sprite) {
    var spr = this.prettySprite(sprite);
    for (var i = 0; i < spr.length; i++) {
        spr[i].anchor.set(0.5);
        spr[i].x += spr[i].width / 2;
        spr[i].y += spr[i].height / 2;
    }
};

pro.sprCenterStiu = function (sprite) {
    var spr = this.prettySprite(sprite);
    for (var i = 0; i < spr.length; i++) {
        spr[i].anchor.set(0.5);
        spr[i].x += this.scene.stage.width / 2;
        spr[i].y += this.scene.stage.height / 2;
    }
};

pro.prettySprite = function (sprite) {
    var arr = [];
    if (sprite instanceof Array) {
        for (var i = 0; i < sprite.length; i++) {
            if (sprite[i] instanceof Object) {
                arr.push(sprite[i]);
            } else if (typeof sprite[i] === 'string') {
                arr.push(this.scene.sprPool[sprite[i]]);
            } else {
                console.error('数据不对 ' + sprite[i]);
            }
        }
    } else if (sprite instanceof Object) {
        arr.push(sprite);
    } else if (typeof sprite === 'string') {
        arr.push(this.scene.sprPool[sprite]);
    } else {
        console.error('数据不对 ' + sprite[i]);
    }
    return arr;
};

module.exports = SpriteDisplayCtr;
