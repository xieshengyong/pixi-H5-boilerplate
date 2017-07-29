/*
 雪碧音&雪碧音

 var newMediaSprite = new MediaSprite({
    wrap: '#videoWrap',   //如果没有wrap,直接添加到body
    type: 'video',         //如果是雪碧音可以填audio, 也可以不填
    src: 'http://hymm.treedom.cn/sound/bg.mp3',
    timeline: {
        'first': {
            begin: 0.0,
            end: 6.0
        },
        'second': {
            begin: 10.0,
            end: 15.0
        }
    }
 });

接口：

newMediaSprite.play(string,function,bool)       {string} 雪碧音的命名
                                                {function} 回调函数
                                                {bool} 是否循环播放

newMediaSprite.started(function)  media开始播放时触发function一次，视频项目时利器；

newMediaSprite.view       返回当前media的dom节点；

el:
mediaSprite.play('first', function (name) {
    console.log(name + ' end');
}, true);

 */

var MediaSprite = function (config) {
    this.config = config;
    this.media = null;

    this.createMedia();
    this.started();
    this.view = this.media;
    this.loopPool = {};
};

var fn = MediaSprite.prototype;

fn.view = null;

fn.loopPool = null;

fn.createMedia = function () {
    var config = this.config;
    var media = this.media;

    if (config.type === 'video') {
        media = document.createElement('video');

        media.setAttribute('webkit-playsinline', '');

        media.setAttribute('playsinline', '');

        media.setAttribute('preload', 'preload');

        // 没播放前最小化，防止部分机型闪现微信原生按钮
        media.style.width = '1px';
        media.style.height = 'auto';
    } else {
        media = document.createElement('audio');
    }

    media.src = config.src;

    media.id = 'spriteMedia' + Math.floor(Math.random() * 100000);

    if (config.wrap) {
        document.querySelector(config.wrap).appendChild(media);
    } else {
        document.body.appendChild(media);
    }

    this.media = document.querySelector('#' + media.id);
};

fn.play = function (name, callback, loop) {
    var self = this;

    var begin = this.config.timeline[name].begin;
    var end = this.config.timeline[name].end;
    var media = this.media;

    media.currentTime = begin;

    console.log(media.currentTime);

    var playHandler = function () {
        if (this.currentTime >= end) {
            if (loop) {
                if (self.loopPool[name] && self.loopPool[name] === 'pause') {
                    console.log('pause');
                    media.removeEventListener('timeupdate', playHandler);
                    return;
                }
                console.log('loop');

                media.currentTime = begin;
            } else {
                this.pause();

                media.removeEventListener('timeupdate', playHandler);

                callback && callback(name);
            }
        }
    };

    media.addEventListener('timeupdate', playHandler);

    // 异步执行防止直接play的报错
    setTimeout(function () {
        media.play();
    }, 0);
};

fn.started = function (callback) {
    var media = this.media;
    var beginTime = function () {
        if (this.currentTime > 0) {
            media.style.width = '100%';

            callback && callback();

            media.removeEventListener('timeupdate', beginTime);
        }
    };

    media.addEventListener('timeupdate', beginTime);
};

module.exports = MediaSprite;
