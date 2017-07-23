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
    this.showSprite = spriteDisplayCtr.showSprite.bind(spriteDisplayCtr);
    this.hideSprite = spriteDisplayCtr.hideSprite.bind(spriteDisplayCtr);
    this.spriteCenter = spriteDisplayCtr.spriteCenter.bind(spriteDisplayCtr);
    this.sprCenterStiu = spriteDisplayCtr.sprCenterStiu.bind(spriteDisplayCtr);
};

module.exports = SceneInit;
