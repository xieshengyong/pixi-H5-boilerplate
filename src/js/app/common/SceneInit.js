var TD = require('../module/TD.js');
var AddChildToStge = require('./AddChildToStge.js');
var SpriteDisplayCtr = require('./SpriteDisplayCtr.js');
var Config = require('../Config.js');

var SceneInit = function (stage) {
    this.log = TD.debug.log;

    this.stage = stage;
    this.path = Config.imgPath;
    this.cache = PIXI.utils.TextureCache;
    this.container = new PIXI.Container();
    this.stage.addChild(this.container);

    this.sprPool = null;

    var addChildToStge = new AddChildToStge(this);
    this.add = addChildToStge.addChild.bind(addChildToStge);

    var spriteDisplayCtr = new SpriteDisplayCtr(this);
    this.show = spriteDisplayCtr.showSprite.bind(spriteDisplayCtr);
    this.hide = spriteDisplayCtr.hideSprite.bind(spriteDisplayCtr);
    this.centerSlf = spriteDisplayCtr.spriteCenterSlf.bind(spriteDisplayCtr);
    this.centerCtn = spriteDisplayCtr.sprCenterCtn.bind(spriteDisplayCtr);
};

module.exports = SceneInit;
