var SpriteDisplayCtr = function (that) {
    this.that = that;
};

var pro = SpriteDisplayCtr.prototype;

pro.hideSprite = function (sprite, duration, vars) {
    var dur = duration || 0;
    var vas = vars || {};
    if (duration === 0) {
        this.directHide(this.prettySprite(sprite));
        return;
    }
    vas.visible = vas.visible || false;
    vas.alpha = vas.alpha || 0;
    TweenLite.to(this.prettySprite(sprite), dur, vas);
};

pro.directHide = function (arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        arr[i].visible = false;
        arr[i].alpha = 0;
    }
};

pro.showSprite = function (sprite, dur, vars) {
    var duration = dur || 0;
    var vas = vars || {};
    if (duration === 0) {
        this.directShow(this.prettySprite(sprite));
        return;
    }
    vas.visible = true;
    vas.alpha = vas.alpha || 1;
    TweenLite.to(this.prettySprite(sprite), duration, vas);
};

pro.directShow = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].visible = true;
        arr[i].alpha = 1;
    }
};

pro.spriteCenterSlf = function (sprite) {
    var spr = this.prettySprite(sprite);
    var len = spr.length;
    for (var i = 0; i < len; i++) {
        spr[i].anchor.set(0.5);
        spr[i].x += spr[i].width / 2;
        spr[i].y += spr[i].height / 2;
    }
};

pro.sprCenterCtn = function (sprite) {
    var spr = this.prettySprite(sprite);
    var len = spr.length;
    var w = this.that.stage.width;
    var h = this.that.stage.height;
    for (var i = 0; i < len; i++) {
        spr[i].anchor.set(0.5);
        spr[i].x += w / 2;
        spr[i].y += h / 2;
    }
};

pro.prettySprite = function (sprite) {
    var arr = [];
    if (sprite instanceof Array) {
        var len = sprite.length;
        for (var i = 0; i < len; i++) {
            arr = arr.concat(this.prettySprite(sprite[i]));
        }
    } else if (sprite instanceof Object) {
        arr.push(sprite);
    } else if (typeof sprite === 'string') {
        arr.push(this.that.sprPool[sprite]);
    } else {
        console.error('数据不对 ' + sprite[i]);
    }
    return arr;
};

module.exports = SpriteDisplayCtr;
