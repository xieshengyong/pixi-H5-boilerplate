var KeyAnimation = function (para) {
    this.sampleName = para.sampleName;
    this.wrap = para.wrap;
    this.num = para.num;
    this.fps = para.fps;
    this.loop = para.loop;
    this.onComplete = para.onComplete;
};

var fn = KeyAnimation.prototype;


module.exports = KeyAnimation;
