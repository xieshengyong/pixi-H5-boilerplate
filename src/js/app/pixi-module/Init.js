// 项目初始化
var Init = {};

// 禁止微信下拉
$(document.documentElement).on('touchmove', function (e) {
    e.preventDefault();
});

var app = new PIXI.Application(750, 1200, {backgroundColor: 0xffffff});
var stageWrap = document.querySelector('.m-stage') || document.querySelector('body');
stageWrap.appendChild(app.view);

Init.stage = app.stage;
Init.stage.interactive = true;
Init.renderer = app.renderer;

app.start();

module.exports = Init;
