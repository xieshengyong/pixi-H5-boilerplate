
interface anyValue {
    [propName: string]: any;
}
interface shareDateValue {
    title: string;
    desc: string;
    link: string;
    img: string;
    proj?: string;
    appid?: string;
    cnzz?: string
}

interface utilValue extends anyValue {
    getQuery: (name: string) => string;
    setCookie: (name: string, value:any, expiredays?: any) => void;
    getCookie: (name: string) => string;
}

interface debugValue extends anyValue {
    log: (info: any, num?: number) => void;
    jump: (callback: () => void) => void;
}

interface TDValue extends anyValue {
    ajax: (pm: any, succback: (data: any) => void, errorback?: (msg: string) => void) => void;
    initWxApi: (shareData: shareDateValue, errback?: () => void, succback?: () => void) => void;
    wxShare: (shareData: shareDateValue, callback?: () => void) => void;
    portraitTips: (el: any) => void;
    rotateScreen: any;
    debug: debugValue;
}

const TD = {} as TDValue;

TD.ajax = function (pm: { type: any; url: any; data: any; }, succback: (arg0: any) => any, errorback: (arg0: string) => any) {
    $.ajax({
        type: pm.type || 'GET',
        url: pm.url,
        dataType: 'json',
        data: pm.data || '',
        success: function (data) {
            if (data.status === 1) {
                succback && succback(data.data);
            } else {
                errorback && errorback(data.message);
            }
        },
        error: function () {
            errorback && errorback('网络连接不稳定，请重试或刷新页面！');
        }
    });
};

/*
data参数说明
data = {
    title: string, 朋友圈标题，给朋友的描述
    desc: string, 给朋友的标题
    link: string, 链接
    img: string, 图标
    track: string, 分享数据上报地址,post {btn:'1'}朋友或{btn:'2'}朋友圈
}
*/
TD.wxShare = function (data: { title: any; link: any; img: any; proj: any; desc: any; }, callback: () => any) {
    wx.onMenuShareTimeline({
        title: data.title, //  分享标题
        link: data.link, //  分享链接
        imgUrl: data.img, //  分享图标
        success: function () {
            callback && callback();
            // 上报朋友圈
            TD.ajax({
                url: 'https://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'timeline',
                    pro: data.proj
                }
            }, function (data) {
                console.log(data);
            }, function (msg) {
                console.log(msg);
            });

            // TD.push(['分享', "朋友圈"]);
            _czc && _czc.push(['_trackEvent', '分享', '朋友圈']);
        },
        cancel: function () {
            //  用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareAppMessage({
        title: data.title, //  分享标题
        desc: data.desc, //  分享描述
        link: data.link, //  分享链接
        imgUrl: data.img, //  分享图标
        success: function () {
            callback && callback();
            // 上报朋友
            TD.ajax({
                url: 'https://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'message',
                    pro: data.proj
                }
            }, function () {}, function (msg) {
                console.log(msg);
            });

            // TD.push(['分享', "好友"]);
            _czc && _czc.push(['_trackEvent', '分享', '好友']);
        },
        cancel: function () {
            //  用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQQ({
        title: data.title, //  分享标题
        desc: data.desc, //  分享描述
        link: data.link, //  分享链接
        imgUrl: data.img, //  分享图标
        success: function () {
            //  用户确认分享后执行的回调函数
            callback && callback();
            // 上报朋友
            TD.ajax({
                url: 'https://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'QQ',
                    pro: data.proj
                }
            }, function () {}, function (msg) {
                console.log(msg);
            });

            // TD.push(['分享', "QQ好友"]);
            _czc && _czc.push(['_trackEvent', '分享', 'QQ好友']);
        },
        cancel: function () {
            //  用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQZone({
        title: data.title, //  分享标题
        desc: data.desc, //  分享描述
        link: data.link, //  分享链接
        imgUrl: data.img, //  分享图标
        success: function () {
            //  用户确认分享后执行的回调函数
            callback && callback();
            // 上报朋友
            TD.ajax({
                url: 'https://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'QZone',
                    pro: data.proj
                }
            }, function () {}, function (msg) {
                console.log(msg);
            });

            // TD.push(['分享', "QZone"]);
            _czc && _czc.push(['_trackEvent', '分享', 'QZone']);
        },
        cancel: function () {
            //  用户取消分享后执行的回调函数
        }
    });

    // 手Q分享
    $('#share-name').attr('content', data.title);
    $('#share-description').attr('content', data.desc);
    $('#share-image').attr('content', data.img);
};

// 初始化微信接口
// 注意，与微信标准data相比，这里多了data.share属性，对应的是初始化页面时有默认的分享数据
TD.initWxApi = function (shareData: shareDateValue, errback: any, succback: () => any) {
    // 服务器获取验证信息
    TD.ajax({
        url: 'https://click.treedom.cn/wx/signature',
        type: 'POST',
        data: {
            appid: shareData.appid,
            url: encodeURIComponent(shareData.link)
        }
    }, function (data) {
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareQZone',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType'
            ]
        });
        wx.ready(function () {
            succback && succback();
            TD.wxShare(shareData);
            wx.getNetworkType({
                success: function (res:any) {
                    var networkType = res.networkType; //  返回网络类型2g，3g，4g，wifi
                    // TD.push(['网络类型', networkType]);
                    _czc && _czc.push(['_trackEvent', '网络类型', networkType]);
                }
            });
        });
    }, function (err) {
        console.log(err);
    });
};

// 提示竖屏函数
TD.portraitTips = function (el: string) {
    var portraitFloat = (typeof el === 'string') ? $(el) : el;

    var orientHandler = function (e?: any) {
        if (window.orientation === 90 || window.orientation === -90) {
            portraitFloat.show();
        } else {
            portraitFloat.hide();
        }
    };
    orientHandler();

    $(window).on('resize', orientHandler.bind(this));
};

/*
检测转屏函数用法
API：TD.rotateScreen.addListener(callback);// 添加事件侦听
     TD.rotateScreen.removeListener();// 取消事件侦听

example:
TD.rotateScreen.addListener(function (data) {
    if(data == 1) {
        console.log('左转屏');
        TD.rotateScreen.removeListener();// 注销事件侦听
    }

    if(data == 2) {
        console.log('右转屏');
    }

    if(data == 3) {
        console.log('竖屏');
    }

    if(data == 4) {
        console.log('倒屏');
    }
})
*/
TD.rotateScreen = (function () {
    var rotate: any;

    var add = function (callback: (num: number) => {}) {
        var num;

        rotate = function (e?: any) {
            if (Math.abs(e.beta) < 15 && e.gamma < -40) {
                num = 1;
                callback && callback(num);// 左转屏
            }
            if (Math.abs(e.beta) < 15 && e.gamma > 40) {
                num = 2;
                callback && callback(num);// 右转屏
            }
            if (e.beta > 40 && Math.abs(e.gamma) < 15) {
                num = 3;
                callback && callback(num);// 竖屏
            }
            if (e.beta < -40 && Math.abs(e.gamma) < 15) {
                num = 4;
                callback && callback(num);// 倒屏
            }
        };

        window.addEventListener('deviceorientation', rotate);
    };

    var remove = function () {
        // 解决ios设备会缓存上次移除deviceorientation事件时角度的问题。
        if (navigator.userAgent.indexOf('Android') > -1) {
            window.removeEventListener('deviceorientation', rotate);
        };
    };

    return {
        addListener: add,
        removeListener: remove
    };
})();

// 网络工具包
export const util = {
    getQuery: function (name: string, target = window.location.search) {
        let m = target.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
        return !m ? '' : m[2];
    },
    setCookie: function (name: string, value: string, expiredays: any) {
        var exdate: any = new Date();
        document.cookie = name + '=' + value + ';expires=' +
            ((expiredays === null) ? exdate.setDate(exdate.getDate() + expiredays) : exdate.toGMTString()) + ';domain=treedom.cn';
    },
    getCookie: function (name: string | any[]) {
        var cStart, cEnd;
        if (document.cookie.length > 0) {
            cStart = document.cookie.indexOf(name + '=');
            if (cStart !== -1) {
                cStart = cStart + name.length + 1;
                cEnd = document.cookie.indexOf(';', cStart);
                if (cEnd === -1) cEnd = document.cookie.length;
                // return unescape(document.cookie.substring(cStart, cEnd));
                return decodeURIComponent(document.cookie.substring(cStart, cEnd));
            }
        }
        return '';
    }
};

export function push (category: string, action: string, label: string, value?: string, e?: any, el?: any) {
    /*
    category:事件类别;action:事件操作;label:事件标签;value:事件值;
    */
    var _category = category || '';
    var _action = action || '';
    var _label = label || '';
    var _value = value || '';
    if (typeof _czc !== 'undefined') {
        _czc.push(['_trackEvent', _category, _action, _label, _value]);
    }
    if (typeof _tdga !== 'undefined') {
        _tdga && _tdga.addEvent(_category, _action, _label, _value, e, el);
    }
    if (typeof PTTSendClick !== 'undefined') {
        PTTSendClick(category, action, label);
    }
};

/*
判断访问终端和语言
    使用：
    if ( push.browser.versions.qq ) {
        console.log('go go');
    }
    注意BUG：在微信内TD.browser.versions.qq也会返回true；
    解决：在判断手Q之后加上微信判断；
*/
export const browser = {
    versions: (function () {
        var u: any = navigator.userAgent;
        // var app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
            qq: u.indexOf('QQ/') > -1, // 是否QQ
            iosVer: u.toLowerCase().match(/cpu iphone os (.*?) like mac os/),
            androidVer: u.toLowerCase().match(/android (.*?);/)
        };
    })(),
    language: (navigator.language).toLowerCase()
};

export default TD;
