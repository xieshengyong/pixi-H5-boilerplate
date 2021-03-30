interface Window {
    PixiPlugin: any;
    dragonBones: any;
    lloogg: any;
    shareText: {
        shareTitle?: string;
        shareDesc?: string;
        shareImgUrl?: string;
        shareLink?: string;
        actName?: string;
        title: string;
        desc: string;
        link?: string;
        image_url: string;
        share_url: string;
        img?: string;
        appid?: string;
        cnzz?: string;
    },
    videoLink: Array<string>;
    webkitAudioContext: AudioContext;
    AudioContext: AudioContext;
    QZAppExternal: any;
    xyJSBridge: any;
    xyJSBridgeIn: any;
    scaleNum: number;
    JSMpeg: any;
}

// todo: interface 补充
interface wxValue {
    config: ({ }) => void;
    ready: ({ }) => void;
    getNetworkType: ({ }) => void;
    onMenuShareTimeline: ({ }) => void;
    onMenuShareAppMessage: ({ }) => void;
    onMenuShareQQ: ({ }) => void;
    onMenuShareQZone: ({ }) => void;
    onMenuShareWeibo: ({ }) => void;
    startRecord: ({ }) => void;
    stopRecord: ({ }) => void;
    playVoice: ({ }) => void;
    pauseVoice: ({ }) => void;
    stopVoice: ({ }) => void;
    uploadVoice: ({ }) => void;
    downloadVoice: ({ }) => void;
}
declare var wx: wxValue;

interface Document {
    readonly msHidden: boolean;
    readonly webkitHidden: boolean;
    [key: string]: any;
}

interface ZeptoCollection {
    fadeOut(num?: any, num2?: any): ZeptoCollection;
    fadeIn(num?: any, num2?: any): ZeptoCollection;
}

// declare var window: Window;

interface anyValue {
    [propName: string]: any;
}

declare var VConsole: any


declare var _czc: any;

declare var _tdga: any;

declare var mediaURLData: any

declare var WeiboJS: any

declare var Tenvideo: any;

declare var Howler: any;
declare var Howl: any;
declare var Particles: any;
declare var PixiFilters: any;

declare module '*.ejs';

declare function TGMobileShare(
    shareConfig: {
        shareTitle: string;
        shareDesc: string;
        shareImgUrl: string;
        shareLink: string;
        actName: string;
        onInit?: (tgms: string) => void;
        onShare?: any;
    }
): void;

declare function PTTSendClick(
    type: string,
    action: string,
    desc: string
): void;

declare namespace MMD {
    class VideoPlayer {
        constructor(
            videoConfig: {
                videoElement: HTMLElement;
                src: string;
                loop?: boolean;
                muted?: boolean;
                poster?: string;
                tryMultipleVideoPlayAtTheSameTime?: boolean;
                timesParam?: Array<{ name: string, time: number }>;
                onTimes?: (name: string) => void;
                onStart?: () => void;
                onEnd?: () => void;
            }
        )
        muted: boolean;
        loop: boolean;
        src: string;
        poster: string;
        timesParam: Array<{ name: string, time: number }>;
        playbackRate: number;
        currentTime: number;
        duration: number;
        currentTimeAndPlay: number;
        currentTimeAndPause: number;
        isVideoCanAutoPlay: boolean;
        paused: boolean;
        public play(): void;
        public pause(): void;
        public replay(): void
    }
}

declare module "iscroll" {
    export = IScroll;
}
