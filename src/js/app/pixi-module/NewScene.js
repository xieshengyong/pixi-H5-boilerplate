var Init = require('./Init.js');
var AddChildToStge = require('./AddChildToStge.js');
var Config = require('../Config.js');

var NewScene = function (Foo) {
    var newFoo = new Foo();

    newFoo.stage = Init.stage;
    newFoo.path = Config.imgPath;
    newFoo.cache = PIXI.utils.TextureCache;
    newFoo.container = new PIXI.Container();
    Init.stage.addChild(newFoo.container);

    newFoo.sprPool = null;

    var addChildToStge = new AddChildToStge(newFoo);
    newFoo.add = addChildToStge.addChild.bind(addChildToStge);

    newFoo.get = Get.bind(Get);

    function Get (spr) {
        spr && (this.spr = prettySprite(spr));
        return this;
    };

    var GetFn = Get;

    GetFn.show = function (dur, foo) {
        console.log(arguments[1]);
        var spr = this.spr;
        var duration = dur || 0.3;
        for (var i = spr.length - 1; i >= 0; i--) {
            spr[i].visible = true;
            if (duration === 0) {
                spr[i].alpha = 1;
            } else {
                TweenLite.to(spr[i], duration, {
                    alpha: 1
                });
            }
        }
        setTimeout(foo, duration * 1000);
        return this;
    };

    GetFn.hide = function () {
        return this;
    };

    GetFn.centerSlf = function () {
         
    };

    GetFn.centerCtn = function () {
         
    };

    GetFn.directShow = function () {
         
    };

    GetFn.directHide = function () {
         
    };

    var prettySprite = function (sprite) {
        var arr = [];
        if (sprite instanceof Array) {
            var len = sprite.length;
            for (var i = 0; i < len; i++) {
                arr = arr.concat(prettySprite(sprite[i]));
            }
        } else if (sprite instanceof Object) {
            arr.push(sprite);
        } else if (typeof sprite === 'string') {
            arr.push(newFoo.sprPool[sprite]);
        } else {
            console.error('数据不对 ' + sprite[i]);
        }
        return arr;
    };

    return newFoo;
};

module.exports = NewScene;
