var Init = require('./Init.js');
var AddChildToStge = require('./AddChildToStge.js');
var SpriteDisplayCtr = require('./SpriteDisplayCtr.js');
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

    newFoo.get = get.bind(newFoo);

    // var spriteDisplayCtr = new SpriteDisplayCtr(newFoo);
    // newFoo.show = spriteDisplayCtr.showSprite.bind(spriteDisplayCtr);
    // newFoo.hide = spriteDisplayCtr.hideSprite.bind(spriteDisplayCtr);
    // newFoo.centerSlf = spriteDisplayCtr.spriteCenterSlf.bind(spriteDisplayCtr);
    // newFoo.centerCtn = spriteDisplayCtr.sprCenterCtn.bind(spriteDisplayCtr);

    return newFoo;
};

var get = function (that) {
     
};

get.show = function () {
     
};

get.hide = function () {
     
};

get.centerSlf = function () {
     
};

get.centerCtn = function () {
     
};

get.directShow = function () {
     
};

get.directHide = function () {
     
};

var prettySprite = function (sprite) {
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

module.exports = NewScene;
