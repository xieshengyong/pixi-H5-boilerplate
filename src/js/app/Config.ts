
// import effect from '../../json/effect.json';
import { Howl, Howler } from 'howler';

export const PublicPath = process.env.NODE_ENV === 'prod' ? process.env.PATH : process.env.PATH + '';

export const SheetDirPath = PublicPath + process.env.sheetPath;

export const DefShare = {
    title: '分享标题',
    desc: '分享描述',
    link: location.href,
    // 分享配图
    img: PublicPath + 'share.jpg',
    // 项目名，数据查询时候用
    proj: '',
    // 填写公众号绑定的appid
    appid: '', // 例如: wx12380ea254191f1b
    cnzz: '' // 例如: 1259179479
};

export let effect: Howl = null;
export let bgm: Howl = null;

export const loadMusic = () => {
    bgm = new Howl({ src: require('../../media/bg.mp3'), loop: true }); // eslint-disable-line
    // Config.bgm.play();
};

// 页面前后台切换时
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // 打开媒体
        if (!$('.mute-icon').hasClass('mute')) {
            Howler.mute(false);
        }
    } else {
        // 关闭媒体
        Howler.mute(true);
    }
});

export function formatJsonList () {
    // @ts-ignore
    let context = require.context('../../img/spriteSheet/', false, /(\.json|\.fnt)/);
    // @ts-ignore
    require.context('../../img/spriteSheet/'); // eslint-disable-line
    let loadDataPool2 = context.keys();
    var list = [];
    for (var i = 0; i < loadDataPool2.length; i++) {
        let name = loadDataPool2[i].slice(2);
        list.push(PublicPath + process.env.sheetPath + name);
    }
    return list;
}

export function formatJsonListDelay () {
    // @ts-ignore
    let context = require.context('../../img/delayLoadSpriteSheet/', false, /(\.json|\.fnt)/);
    // @ts-ignore
    require.context('../../img/delayLoadSpriteSheet/'); // eslint-disable-line
    let loadDataPool2 = context.keys();
    var list = [];
    for (var i = 0; i < loadDataPool2.length; i++) {
        let name = loadDataPool2[i].slice(2);
        list.push(PublicPath + process.env.sheetPath + name);
    }
    return list;
}

export function formatImgList () {
    // @ts-ignore
    let context = require.context('../../img/autoLoad/', true);
    let Imglist = context.keys();
    var list = [];
    for (var i = 0; i < Imglist.length; i++) {
        let name = Imglist[i].slice(2);
        list.push({
            name: name,
            url: require('../../img/autoLoad/' + name)
            // crossOrigin: ''
        });
    }
    return list;
};

export function formatDelayImgList () {
    // @ts-ignore
    let context = require.context('../../img/delayLoadImg/', true);
    let Imglist = context.keys();
    var list = [];
    for (var i = 0; i < Imglist.length; i++) {
        let name = Imglist[i].slice(2);
        list.push({
            name: name,
            url: require('../../img/delayLoadImg/' + name)
        });
    }
    return list;
};
