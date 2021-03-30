/* eslint-disable no-unused-vars */
import ViewController from './tool/ViewController';
import Config, { formatDragonBonesAssets, formatImgList, formatDelayImgList, formatJsonList, formatJsonListDelay } from './Config';
import PX from './tool/PX';
import TD, { browser, util, push, scriptLoader } from './tool/TD';
import { delay, getRandom } from './tool/BaseTools';
// import dragonBones from './util/dragonBones';
// window.dragonBones = dragonBones;

// 项目初始化的一些函数
var initProject = async function () {
    /* 自动添加cnzz统计代码 */
    // Config.defShare.cnzz && document.write(unescape('%3Cspan style="display: none" id="cnzz_stat_icon_' + Config.defShare.cnzz + '"%3E%3C/span%3E%3Cscript src="' + 'https://s4.cnzz.com/z_stat.php%3Fid%3D' + cnzzID + '" type="text/javascript"%3E%3C/script%3E'));

    /* 初始化微信接口 */
    // Config.defShare.appid && TD.initWxApi(Config.defShare);

    /* 阻止微信下拉；原生js绑定覆盖zepto的默认绑定 */
    document.body.addEventListener('touchmove', function (e) {
        const event = e || window.event;
        // @ts-ignore
        const className = event.target.getAttribute('class');
        /* 有滚动内容时取消阻止下拉 */
        if (/permit-scroll/.test(className) === false) {
            event.preventDefault();
        }
    }, { passive: false });

    /** 解决ios12微信input软键盘收回时页面不回弹，兼容动态添加dom(腾讯登录组件)的情况 */
    var resetScroll = (function () {
        var timeWindow = 500;
        var timeout: any; // time in ms
        var functionName = function () {
            let inputEl = $('input, select, textarea');
            // TODO: 连续添加元素时，可能存在重复绑定事件的情况
            inputEl && inputEl.on('blur', () => {
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight, 0));
            });
        };

        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                functionName.apply(this);
            }, timeWindow);
        };
    }());
    browser.versions.ios && $('body').on('DOMSubtreeModified', resetScroll);

    // DEBUG: 显示vconsole工具
    if (util.getQuery('vconsole') === '1') {
        scriptLoader(require('../lib/vconsole.min.js'), () => {
            new VConsole(); // eslint-disable-line
            console.log('Hello world');
        });
    }

    // DEBUG: 全局静音
    util.getQuery('mute') === '1' && Howler.mute(true);
};

export default class LoadViewController extends ViewController {
    // [propName: string]: any;
    media: HTMLVideoElement;
    videoPlayer: MMD.VideoPlayer;
    notLoadMoreAnim: Boolean;

    private init () {
        // 防止IOS序列帧动画抖动
        if (browser.versions.ios) {
            PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
        }

        // 安卓8、IOS12以下不加载更多动画；
        Config.notLoadMoreAnim = parseInt(browser.versions.androidVer?.[1]) < 8 || parseInt(browser.versions.iosVer?.[1]) < 12;

        // register the plugin
        gsap.registerPlugin(PixiPlugin);
        // give the plugin a reference to the PIXI object
        PixiPlugin.registerPIXI(PIXI);

        PX.init(document.querySelector('.m-stage-wrap canvas'), 1600, 750);

        initProject();
    }

    /** 延迟加载 */
    private loadSecond () {
        console.log('loadSecond');
        this.loadSecond = null;
        if (Config.notLoadMoreAnim) return false;

        return new Promise<Boolean>((resolve, reject) => {
            PIXI.Loader.shared
                .add(formatDelayImgList())
                .add(formatJsonListDelay())
                .add(formatDragonBonesAssets())
                .load(() => {
                    this.instace.emit('secondLoadEnd');
                    resolve(true);
                });
        });
    }

    /** 首次加载 */
    private load () {
        let loadingProcess = $('.m-loading .load-process');
        let loader = new PIXI.Loader();
        loader.onStart.add(() => console.log('begin load'));
        loader
            .add(formatImgList())
            .add(formatJsonList())
            .load(async () => {
                loadingProcess.html('点击开始');

                this.initEvent();
                this.initVideo();

                Config.loadMusic();

                // DEBUG: 跳过视频
                if (util.getQuery('_debug') === '1') {
                    $('.m-loading').fadeOut();
                    this.showIndex();
                    this.hideVideo();
                    await delay(2);
                    await this.loadSecond();
                } else {
                    this.loadEnding();
                }

                push('page', 'loading', '加载完成，耗时：' + (Date.now() - beginLoadTime));
            })
            .onProgress.add((params) => {
                loadingProcess.html(Math.floor(params.progress) + '%');
            });

        let beginLoadTime = Date.now();
        push('page', 'loading', '加载开始时间：' + beginLoadTime);
    }

    private showIndex (debug?: boolean) {
        this.emit('showIndex', debug);
    }

    private showVideo (debug?: boolean) {
        $('.m-loading').fadeOut();
        $('.m-index').fadeIn();
    }

    private loadEnding () {
        this.loadSecond();
    }

    private initEvent () {
        this.once('videoStart', async () => {
            console.log('video start');
            this.showVideo();
            $('.m-icon-loading').fadeOut(100);
        });

        this.once('videoEnd', () => {
            this.hideVideo();
        });

        $('.m-loading').one('click', () => {
            this.videoPlayer.play();
            $('.m-icon-loading').fadeIn(200);
            push('btn', 'startVideo', '开始播放视频');
        });
    }

    private initVideo () {
        this.media = document.querySelector('#video');
        this.media.setAttribute('x5-video-player-fullscreen', 'false');
        this.media.setAttribute('x5-video-player-type', 'h5-page');

        /* 监听视频开始播放，解决部分情况下MMD.VideoPlayer的onStart失效问题 */
        const timeListener = () => {
            if (this.media.currentTime <= 0) return;
            this.emit('videoStart');
            this.media.removeEventListener('timeupdate', timeListener);
        };
        this.media.addEventListener('timeupdate', timeListener);

        let mediaSrc;
        if (process.env.NODE_ENV === 'handover' && process.env.NODE_ENV2 !== 'qn') {
            mediaSrc = mediaURLData[7653];
        } else {
            mediaSrc = require('../../media/video.mp4');
        }
        this.media.src = mediaSrc;
        this.videoPlayer = new MMD.VideoPlayer({
            videoElement: this.media,
            src: mediaSrc,
            timesParam: [
                {
                    name: 'showSkip',
                    time: 2
                },
                {
                    name: 'end',
                    time: 8
                }
            ],
            loop: false,
            muted: false,
            poster: '',
            tryMultipleVideoPlayAtTheSameTime: false,
            onTimes: async (name) => {
                console.log('name :>> ', name);
                switch (name) {
                    case 'showSkip':
                        this.showIndex();
                        break;
                    case 'end':
                        this.emit('videoEnd');
                        break;
                    default:
                        break;
                }
            },
            onStart: () => {
                this.emit('videoStart');
            },
            onEnd: () => {
                this.emit('videoEnd');
            }
        });
    }

    private async hideVideo () {
        this.media.pause();
        $('.m-stage-wrap').fadeIn(0);
        await delay(0.2);
        $('.m-index').fadeOut(400);
        // 静音按钮
        $('.mute-icon').fadeIn();
    }

    public show () {
        this.init();
        this.load();
    }

    public hide () {
    }

};
