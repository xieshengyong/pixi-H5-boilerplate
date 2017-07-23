// 项目初始化
var Init = function () {
    this.initProject();
    this.initPIXI();
};

var fn = Init.prototype;

fn.initProject = function () {
    // 禁止微信下拉
    $(document.documentElement).on('touchmove', function (e) {
        e.preventDefault();
    });
};

fn.initPIXI = function () {
    this.stage = new PIXI.Container();
    this.stage.interactive = true;
    this.ticker = new PIXI.ticker.Ticker();

    this.initRenderer();

    this.ticker.add(this.update, this);
    this.ticker.start();
};

fn.initRenderer = function () {
    this.renderer = PIXI.autoDetectRenderer(750, 1200, {preserveDrawingBuffer: true});
    this.renderer.backgroundColor = 0xffffff;
    document.querySelector('.m-stage').appendChild(this.renderer.view);
};

fn.update = function () {
    this.renderer.render(this.stage);
};

module.exports = Init;
