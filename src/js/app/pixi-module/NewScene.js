var AddChildToStge = require('./AddChildToStge.js');
var Config = require('../Config.js');

// 禁止微信下拉
$(document.documentElement).on('touchmove', function (e) {
    e.preventDefault();
});

// 项目初始化
var app = new PIXI.Application(750, 1200, {backgroundColor: 0xffffff});
var stageWrap = document.querySelector('.m-stage') || document.querySelector('body');
stageWrap.appendChild(app.view);
app.stage.interactive = true;
app.start();

var NewScene = function (Foo) {
    var newFoo = new Foo();

    newFoo.stage = app.stage;
    newFoo.screen = app.screen;
    newFoo.path = Config.imgPath;
    newFoo.cache = PIXI.utils.TextureCache;
    newFoo.container = new PIXI.Container();
    app.stage.addChild(newFoo.container);

    newFoo.sprPool = null;

    var addChildToStge = new AddChildToStge(newFoo);
    newFoo.add = addChildToStge.addChild.bind(addChildToStge);

    newFoo.get = Get.bind(Get);

    function Get (spr) {
        spr && (this.spr = prettySprite(spr));
        return this;
    };

    var GetFn = Get;

    GetFn.show = function () {
        var args = prettyArgument.call(this, arguments);
        var duration = args.duration;
        var delay = args.delay;
        var spr = this.spr;
        for (var i = spr.length - 1; i >= 0; i--) {
            spr[i].visible = true;
            if (duration === 0) {
                spr[i].alpha = 1;
            } else {
                TweenLite.to(spr[i], duration, {
                    alpha: 1,
                    delay: delay
                });
            }
        }
        return this;
    };

    GetFn.hide = function () {
        var args = prettyArgument.call(this, arguments);
        var duration = args.duration;
        var delay = args.delay;
        var spr = this.spr;
        for (var i = spr.length - 1; i >= 0; i--) {
            spr[i].visible = true;
            if (duration === 0) {
                spr[i].alpha = 0;
            } else {
                TweenLite.to(spr[i], duration, {
                    alpha: 0,
                    delay: delay
                });
            }
        }
        return this;
    };

    GetFn.centerSlf = function () {
        var spr = this.spr;
        for (var i = spr.length - 1; i >= 0; i--) {
            spr[i].anchor.set(0.5);
            spr[i].x += spr[i].width / 2;
            spr[i].y += spr[i].height / 2;
        }
        return this;
    };

    GetFn.centerCtn = function (stage) {
        if (!stage) console.error('stage is undefined');
        var spr = this.spr;
        var w = stage.width;
        var h = stage.height;
        for (var i = spr.length - 1; i >= 0; i--) {
            spr[i].anchor.set(0.5);
            spr[i].x += w / 2;
            spr[i].y += h / 2;
        }
        return this;
    };

    GetFn.to = function (dur, vas) {
        var spr = this.spr;
        TweenLite.to(spr, dur, vas);
        return this;
    };

    GetFn.from = function (dur, vas) {
        var spr = this.spr;
        TweenLite.from(spr, dur, vas);
        return this;
    };

    /* 私有方法 */

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

    var prettyArgument = function (argument) {
        var oo = {};
        var duration = 0.3;
        var delay = 0;
        var callback = null;
        if (argument.length > 0) {
            var argument0 = argument[0];
            if (typeof argument0 === 'number') {
                duration = argument0;
            } else if (typeof argument0 === 'function') {
                callback = argument0;
            }
            if (argument[1]) {
                var argument1 = argument[1];
                if (typeof argument1 === 'number') {
                    delay = argument1;
                } else if (typeof argument1 === 'function') {
                    callback = argument1;
                }
            }
            if (argument[2]) {
                var argument2 = argument[2];
                if (typeof argument2 === 'number') {
                    delay = argument2;
                } else if (typeof argument2 === 'function') {
                    callback = argument2;
                }
            }
            callback && setTimeout(callback.bind(this), (duration + delay) * 1000);
        }
        oo.duration = duration;
        oo.delay = delay;
        return oo;
    };

    return newFoo;
};

module.exports = NewScene;
