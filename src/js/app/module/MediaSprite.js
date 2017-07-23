/*
*
***  How to use ***

** style **
.m-video{
  position: absolute;
  z-index: 0;
  width: 1px;
  height: 1px;
}

** 初始化 **
let MediaSprite = new TD.MediaSprite({
  wrap: '#videoWrap',   //如果没有wrap,直接添加到body
  type: 'video',         //如果是雪碧音可以填audio, 也可以不填
  src: 'http://hymm.treedom.cn/sound/bg.mp3',
  classname: '.m-video'
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

** gotoAndPlay() **
 @param {string} 雪碧音的命名
 @param {function} 回调函数, 函数参数为雪碧音名字
 @param {bool} 是否循环播放

 mediaSprite.play('first', function (name) {
 console.log(name + ' end');
 }, true);

 */

const MediaSprite = function (config) {

    const _config = config;
    let media = null;
    let dom_wrap = config.wrap ? document.querySelector(config.wrap) : null;
    let isInit = false;
    let _currentHandler = null;

    let resizeVideo = function (config) {

        config = config || {};
        config.width = config.width || 750;
        config.height = config.height || 1200;
        config.type = config.type || 'contain'; // 'cover'、'contain'
        // console.log(config);
        console.log("resizeVideo");

        let resizeGo = function () {

            if( this.currentTime > 0 ) {
                let width = config.width/100+'rem';

                let height = config.height/100+'rem';

                if(config.type == 'cover'){
                    media.style.top = '50%';
                    media.style.left = '50%';
                    media.style.width = width;
                    media.style.height = height;
                    media.style.margin = '-6.83rem 0 0 -3.75rem';
                }else{
                    media.style.width = '100%';
                    media.style.height = '100%';
                }

                media.removeEventListener('timeupdate', resizeGo);

                media.currentTime = 0;

            }

        };

        media.addEventListener('timeupdate', resizeGo);

    };

    let _createMedia = function () {

        if(_config.type == 'video'){

            media = document.createElement('video');

            media.setAttribute('webkit-playsinline', '');
            media.setAttribute('playsinline', '');
            media.setAttribute('preload', 'preload');
            media.className = _config.classname;

        } else {
            media = document.createElement('audio');
        }

        media.src = _config.src;

        media.id = 'spriteMedia' + Math.floor(Math.random()*100000);

        if( dom_wrap ) {
            dom_wrap.querySelector('.wrap') ? dom_wrap.querySelector('.wrap').appendChild(media) : dom_wrap.appendChild(media);
            dom_wrap.style.zIndex = 0;
        } else {
            document.body.appendChild(media);
        }

    };

    let gotoAndPlay = function (name, callback, loop) {

        let begin = _config.timeline[name].begin;
        let end = _config.timeline[name].end;

        console.log(name, begin, end);

        media.currentTime = begin;

        media.style.visibility = 'visible';

        if (!isInit) {
            // todo: 放大视频
            resizeVideo();
            isInit = true;
        }

        let playHandler = function () {

            if(this.currentTime >= end){

                if(loop){
                    media.currentTime = begin;
                } else {

                    this.pause();

                    if (dom_wrap) {
                        dom_wrap.style.zIndex = 0;
                    } else {
                        media.style.zIndex = 0;
                    }

                    media.style.visibility = 'hidden';
                    media.removeEventListener('timeupdate', playHandler);

                    callback && callback(name);

                }

            }
        };

        media.removeEventListener('timeupdate', _currentHandler);

        media.addEventListener('timeupdate', playHandler);

        // 0延时将plpy()请求置于队列末位消除回调里直接play的报错，by————xsy
        setTimeout(function () {
            media.play();
            if (dom_wrap) {
                dom_wrap.style.zIndex = 99;
            } else {
                media.style.zIndex = 99;
            }
        }, 0);

        _currentHandler = playHandler;
    };

    let _init = function () {

        _createMedia();

    };

    let pause = function () {
        media.pause();
    };

    let play = function () {
        media.play();
    };

    let stop = function () {
        media.pause();
        media.style.visibility = 'hidden';
    };

    _init();

    return {
        gotoAndPlay: gotoAndPlay,
        pause: pause,
        play: play,
        dom: media,
        stop: stop
    }
};

module.exports = MediaSprite;
