
// import effect from '../../json/effect.json';

const Config = {} as anyValue;

// 图片路径前缀
Config.imgPath = process.env.NODE_ENV === 'handover' ? process.env.PATH : process.env.PATH + 'img/';

// 默认分享语
Config.defShare = {
    title: '分享标题',
    desc: '分享描述',
    link: location.href,
    // 分享配图
    img: Config.imgPath + 'share.jpg',
    // 项目名，数据查询时候用
    proj: '',
    // 填写公众号绑定的appid
    appid: '', // 例如: wx12380ea254191f1b
    cnzz: '' // 例如: 1259179479
};

Config.talkSound = { play: () => { } };
Config.effect = { play: () => { } };
Config.bgm = { play: () => { } };

Config.loadMusic = () => {
    Config.bgm = new Howl({ src: require('../../media/bg.mp3'), loop: true }); // eslint-disable-line
    // Config.bgm.play();
};

Config.userInfo = {};

Config.bottlesInfo = {};

// 页面前后台切换时
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // 打开媒体
        if (!$('.mute-icon').hasClass('mute')) {
            window.Howler && Howler.mute(false);
        }
    } else {
        // 关闭媒体
        window.Howler && Howler.mute(true);
    }
});

export default Config;

export function formatJsonList () {
    // @ts-ignore
    let context = require.context('../../img/spriteSheet/', false, /(\.json|\.fnt)/);
    // @ts-ignore
    require.context('../../img/spriteSheet/'); // eslint-disable-line
    let loadDataPool2 = context.keys();
    var list = [];
    for (var i = 0; i < loadDataPool2.length; i++) {
        let name = loadDataPool2[i].slice(2);
        list.push(Config.imgPath + 'spriteSheet/' + name);
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
        list.push(Config.imgPath + 'delayLoadSpriteSheet/' + name);
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
            url: require('../../img/autoLoad/' + name),
            crossOrigin: ''
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

export function formatDragonBonesAssets () {
    // @ts-ignore
    let context1 = require.context('../../img/dragonBonesAssets', false, /\.json|\.png/);// eslint-disable-line
    // TODO: JSON合并到js资源
    // const requireAll = context => context.keys().map(context);
    // requireAll(context1).forEach((item) => {
    //     console.log('item :', item);
    // });
    let loadData = context1.keys();
    // console.log('requireAll(context1) :', requireAll(context1));
    // console.log('context1 :', context1(loadData[0]));

    // context1.keys().forEach((path) => {
    //    if (condition) {

    //    }
    // });

    // let aa = loadData.map(loadData);
    var list = [];
    for (var i = 0; i < loadData.length; i++) {
        let name = loadData[i].slice(2);
        list.push({
            name: name,
            url: Config.imgPath + 'dragonBonesAssets/' + name
        });
    }
    return list;
}
