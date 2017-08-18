var AnimatedSprite = function (vars) {
    var self = this;

    this.TextureCache = PIXI.utils.TextureCache;

    this.stage = vars.stage;
    this.path = vars.path;
    this.preName = vars.sampleName.substring(0, vars.sampleName.indexOf('.'));
    this.fixName = vars.sampleName.substring(vars.sampleName.indexOf('.'));
    this.num = vars.num;
    this.speed = vars.speed;
    this.loop = vars.loop;
    this.position = vars.position || [0, 0];
    this.onComplete = vars.onComplete;
    this.onFrameChange = vars.onFrameChange;

    this.debugPath();

    return self.addTostage();
};

var fn = AnimatedSprite.prototype;

fn.debugPath = function () {
    this.path = this.TextureCache[this.path + this.preName + '0' + this.fixName] ? this.path : '';
};

fn.addTostage = function () {
    var self = this;

    var aniFrames = [];

    for (var i = 0; i < this.num; i++) {
        var texture = this.TextureCache[this.path + this.preName + i + this.fixName];
        aniFrames.push(texture);
    }

    var anim = new PIXI.extras.AnimatedSprite(aniFrames);
    anim.animationSpeed = this.speed;
    anim.loop = this.loop;
    anim.x = this.position[0];
    anim.y = this.position[1];

    anim.onComplete = function () {
        // anim.alpha = 0;
        self.onComplete && self.onComplete();
    };

    anim.onFrameChange = this.onFrameChange;

    self.stage.addChild(anim);

    return anim;
};

module.exports = AnimatedSprite;
