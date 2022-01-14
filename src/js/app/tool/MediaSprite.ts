/*
 * @Author: xieshengyong
 * @Date: 2022-01-13 16:14:05
 * @LastEditTime: 2022-01-14 14:30:39
 * @LastEditors: xieshengyong
 */
/*
    如何使用：

    HTML:
    <div class="video-box abcter">
        <video src="" id="video" class="video absf"></video>
        <canvas id="videocanvas" class="video absf"></canvas>
    </div>

    CSS:
    .video{
        display: none;
    }

    JS:
    import 'jsmpeg.min.js';
    import MediaSprite from 'MediaSprite';
    
    let player = new MediaSprite(
        [{
            element: document.querySelector('#video'),
            src: require('../../media/video.mp4')
        }, {
            element: document.querySelector('#videocanvas'),
            src: 'http://localhost:6543/out.ts'
        }],
        [{
            name: 'add',
            time: 2
        }]
    );
    player.play();
    player.on('add', (ti: number) => {
        console.log(ti);
    }); 
*/

interface ElementAndSrc {
    element: HTMLVideoElement | HTMLCanvasElement;
    src: string;
}

enum EleType { VIDEO, CANVAS };

interface TimeLineType {
    name: string;
    time: number;
}

interface CbsType {
    name: string;
    cb: Function;
    time: number;
    once: boolean;
    activing?: boolean;
}

const Gap = 0.5;

export default class MediaSprite {
    private timeline: TimeLineType[];
    private loop: boolean;
    private muted: boolean;
    private cbs: CbsType[];
    
    public media: HTMLVideoElement;

    /**
     * 兼容Video 和 JSMPEG 的视频播放插件
     * 
     * @param {ElementAndSrc[]} targets
     * @param {TimeLineType[]} timeline
     * @param {boolean} [loop=false]
     * @param {boolean} [muted=false]
     * @memberof MediaSprite
     */
    constructor(
        targets: ElementAndSrc[],
        timeline: TimeLineType[],
        loop = false,
        muted = false
    ) {
        this.loop = loop;
        this.muted = muted;
        
        this.media = this.getMedia(targets)

        this.timeline = timeline;

        this.cbs = [];
    }

    private onTimeupdate () {
        for (let index = 0; index < this.cbs.length; index++) {
            const ele = this.cbs[index];
            if (this.media.currentTime >= ele.time && !ele.activing && this.media.currentTime < ele.time + Gap) {
                ele.cb(ele.time);
                ele.activing = true;
                if (ele.once) {
                    this.cbs.splice(index, 1);
                    index--;
                }
            }
            if (ele.activing && this.media.currentTime >= ele.time + Gap) {
                ele.activing = false;
            }
        }
    }

    private getMedia(targets: ElementAndSrc[]) {
        if (this.isAndroidBrowser() && this.getMediaParam(targets, EleType.CANVAS)) {
            let mediaParam = this.getMediaParam(targets, EleType.CANVAS);
            let media = new window.JSMpeg.Player(mediaParam.src, {
                canvas: mediaParam.element,
                loop: this.loop,
                muted: this.muted,
                decodeFirstFrame: true,
                chunkSize: 1 * 1024 * 1024,
                onVideoDecode: this.onTimeupdate.bind(this)
            });
            mediaParam.element.style.display = 'block';

            return media;
        } else {
            let mediaParam = this.getMediaParam(targets, EleType.VIDEO);
            // @ts-ignore
            let media: HTMLVideoElement = mediaParam.element;
            this.loop && (media.loop = true);
            this.muted && (media.muted = true);
            media.setAttribute('webkit-playsinline', '');
            media.setAttribute('playsinline', '');
            media.setAttribute('preload', 'preload');
            media.setAttribute('x5-video-player-fullscreen', 'false');
            media.setAttribute('x5-video-player-type', 'h5-page');
            media.src = mediaParam.src;
            media.addEventListener('timeupdate', this.onTimeupdate.bind(this));
            media.style.display = 'block';

            return media;
        }
    }

    private getMediaParam(targets: ElementAndSrc[], type: EleType) {
        return targets.find(ele => {
            if (ele.element.nodeName === EleType[type]) {
                return true;
            }
        });
    }

    private isAndroidBrowser () {
        var u = navigator.userAgent;
        if (
            (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) && 
            !(u.indexOf('MicroMessenger') > -1) && 
            !(u.indexOf('QQ/') > -1)
        ) {
            return true;
        }
    }

    play() {
        this.media.play();
    }

    pause() {
        this.media.pause();
    }

    gotoAndPlay(time: number) {
        this.media.currentTime = time;
        this.media.play();
    }

    gotoAndPause(time: number) {
        this.media.currentTime = time;
        this.media.pause();
    }

    on(name: string, callback: Function, once = false) {
        this.timeline.find((ele) => {
            if (ele.name === name) {
                this.cbs.push({ name: name, cb: callback, time: ele.time, once: once });
                return true;
            }
        })
    }

    off(name: string, callback?: Function) {
        for (let index = 0; index < this.cbs.length; index++) {
            const ele = this.cbs[index];
            if (callback) {
                if (ele.name === name && ele.cb === callback) {
                    this.cbs.splice(index, 1);
                    index--;
                }
            } else if (ele.name === name) {
                this.cbs.splice(index, 1);
                index--;
            }
        }
    }
};
