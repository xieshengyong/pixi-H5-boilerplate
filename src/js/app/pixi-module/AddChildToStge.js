var AddChildToStge = function (that) {
    this.that = that;
    this.pool = {};
};

var fn = AddChildToStge.prototype;

fn.addChild = function (sprites, stg) {
    var path = this.that.path;
    var cache = this.that.cache;
    var stage = stg || this.that.stage;

    var sLength = sprites.length;
    for (var i = 0; i < sLength; i++) {
        var spr = sprites[i];
        var spr0 = sprites[i][0];
        if (spr0 === 'rect') {
            this.addRect(spr, stage);
            continue;
        }
        if (typeof spr0 === 'string') {
            this.addSprite(spr, cache, path, stage);
        }
        if (spr instanceof Function) {
            spr();
        }
    }
    this.that.sprPool = this.pool;
    this.pool = null;
};

fn.addSprite = function (spr, cache, path, stage) {
    var pool = this.pool;
    var name = spr[0].substring(0, spr[0].indexOf('.'));
    var sprite = new PIXI.Sprite(cache[path + spr[0]]);
    sprite.alpha = 0;
    sprite.visible = false;
    sprite.x = spr[1];
    sprite.y = spr[2];
    spr[3] && (sprite.interactive = true);
    stage.addChild(sprite);
    if (pool[name]) {
        console.error(name + 'has been created');
    }
    pool[name] = sprite;
};

fn.addRect = function (spr, stage) {
    var pool = this.pool;
    var name = spr[1];
    var color = spr[6] || 0xFF700B;
    var rect = new PIXI.Graphics();
    rect.beginFill(color, 0);
    rect.drawRect(spr[2], spr[3], spr[4], spr[5]);
    rect.visible = false;
    rect.interactive = true;
    stage.addChild(rect);
    if (pool[name]) {
        console.error(name + 'has been created');
    }
    pool[name] = rect;
};

module.exports = AddChildToStge;
