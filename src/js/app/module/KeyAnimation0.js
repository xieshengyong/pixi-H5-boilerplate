/*
// 动画帧播放器v.0.3
el：canvas容器，jq对象；
type：图片源模式，'array'和'sprite'模式，array需要后面提供图片对象数组，sprite需要提供基于宽度扩展的单张雪碧图
imgs：图片帧对象数组或单图，对应不同模式；
options:{
    cover: 10, //从数组中指定cover，默认是0
    fps: 30, //默认是24
    loop: 10 //初始化默认的循环数，在formTo中可以设置，默认是infinite,
    resolution: 2 //雪碧图模式才需要，图片的高清比例，与@2x相似，默认是2，低清模式是1,
    width: 300, //注意，隐藏元素是拿不到宽度的，所以特殊情况下需要指定宽度
    height: 300
}
参数1:启始帧（从0开始），参数2:结束帧数，参数3:循环次数，默认是infinite
KeyAnimation.fromTo(10, 20, 1, callback);

参数1:启始帧（从高位开始），参数2:结束帧数（从低位结束），参数3:循环次数，默认是infinite；与fromTo的区别是倒着播放
KeyAnimation.toFrom(20, 10, 1, callback);

参数1:启始帧（从0开始），参数2:结束帧数，参数3:循环次数，默认是infinite
正播过去，再倒播回来
KeyAnimation.repeatplay(10, 20, 1, callback);

参数1:启始帧（从0开始），参数2:循环次数，默认是infinite
KeyAnimation.from(10, 1, callback);

参数1:结束帧数，参数2:循环次数，默认是infinite
KeyAnimation.to(20, 1, callback);

跳到某一帧
KeyAnimation.goto(10);

向后一帧或向前一帧，
KeyAnimation.next();
KeyAnimation.prev();

暂停动画，目前只是使计时器内部函数不再运作，不推荐使用该方法
KeyAnimation.pause();

停止并回到第一帧或cover帧
KeyAnimation.stop();

//从当前位置播放动画，会继承上次使用fromTo、form或to的属性
KeyAnimation.play(callback);

//获取当前状态，值有“stop、play”
KeyAnimation.getState();

//获取图片数组长度
KeyAnimation.getLen();

//销毁对象
KeyAnimation.destroy();
*/

const KeyAnimation = function (el, type, imgs, options) {
    if (!el || !imgs) {
        throw new Error('el、imgs是必选填参数');
        // return false;
    }
    if (type !== 'array' && type !== 'sprite') {
        throw new Error('只支持"array"和"sprite"模式');
        // return false;
    }
    // let that = this;
    let imgsLen = null;
    let canvas = null;
    let count = 0;
    let ctx = null;
    let timeMac = null;
    let state = 'stop';
    // 用投机取巧的做法试试，这个值基本代表了无限
    let infinite = 1000000000;
    let plusNum = null;
    let plusCount = 0;
    let ispause = false;

    // 会有'array'和'sprite'模式
    let mode = type;

    // 默认参数
    let defOpt = {
        cover: 0,
        fps: 24,
        loop: 'infinite',
        resolution: 2
    };
    // 初始化可选参数
    options = options || defOpt;
    options.cover = options.cover || defOpt.cover;
    options.fps = options.fps || defOpt.fps;
    options.loop = options.loop || defOpt.loop;
    // 图片分辨比例，与@2x的概念相似，只有sprite需要该选项，默认为2
    options.resolution = options.resolution || defOpt.resolution;

    // 记录上一次播放行为
    let recordFrom = 0;
    let recordTo = null;
    let recordInf = options.loop;

    let createCanvas = function () {
        canvas = $('<canvas>').get(0);
        ctx = canvas.getContext('2d');
        canvas.width = options.width * 2 || el.width() * 2;
        canvas.height = options.height * 2 || el.height() * 2;
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        el.append(canvas);
    };

    // drawImg
    let drawImg = function (n) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (mode === 'array') {
            // 先判断图片有没有宽度，如果没有，一般是图片没有加载下来
            if (imgs[n].width !== 0) {
                ctx.drawImage(imgs[n], 0, 0, canvas.width, canvas.height);
            };
        } else if (mode === 'sprite') {
            let imgWidth = imgs.width / imgsLen;
            ctx.drawImage(imgs, imgWidth * n, 0, imgWidth, imgs.height, 0, 0, canvas.width, canvas.height);
        } else {
            console.log('没有匹配模式');
        }
    };

    let showCover = function () {
        drawImg(options.cover);
    };

    let init = function () {
        createCanvas();

        if (mode === 'array') {
            imgsLen = imgs.length;
        } else {
            // 计算出有多少张雪碧图
            imgsLen = Math.round((2 * imgs.width) / (canvas.width * options.resolution));
        }
        console.log('current mode is:' + mode);
        recordTo = imgsLen - 1;

        showCover();
    };

    // API list

    this.goto = function (n) {
        drawImg(n);
        count = n;
    };

    this.next = function () {
        let n = (count + 1 + imgsLen - 1) % (imgsLen - 1);
        this.goto(n);
    };

    this.prev = function () {
        let n = (count - 1 + imgsLen - 1) % (imgsLen - 1);
        this.goto(n);
    };

    this.fromTo = function (from, to, loop, callback) {
        // 每次调用前先清理上次未执行完的动画
        clearInterval(timeMac);

        let that = this;
        let keyCount = from;
        let timeFn = function () {
            if (ispause) {
                return;
            }
            if (plusNum <= plusCount) {
                clearInterval(timeMac);
                timeMac = null;
                plusCount = 0;
                plusNum = 0;
                state = 'stop';
                callback && callback();
                return;
            } else {
                if (keyCount > to) {
                    keyCount = from;
                };
                that.goto(keyCount);
                // 帧计数器
                keyCount++;
                // 总量计数器
                plusCount++;
            }
            // 播放进度回调
            that.playBack && that.playBack(keyCount / imgsLen);
        };
        plusCount = 0;
        state = 'play';
        loop = !loop || loop === 'infinite' ? infinite : loop;
        // 总量
        plusNum = (to - from + 1) * loop;
        ispause = false;

        // 做一下记录
        recordFrom = from;
        recordTo = to;
        recordInf = loop;

        timeFn();
        timeMac = setInterval(timeFn, 1000 / options.fps);
    };

    // 倒着播，特殊运用
    this.toFrom = function (to, from, loop, callback) {
        // 每次调用前先清理上次未执行完的动画
        clearInterval(timeMac);

        let that = this;
        let keyCount = to;
        let timeFn = function () {
            if (ispause) {
                return;
            }
            if (plusNum <= plusCount) {
                clearInterval(timeMac);
                timeMac = null;
                plusCount = 0;
                plusNum = 0;
                state = 'stop';
                callback && callback();
                return;
            } else {
                if (keyCount < from) {
                    keyCount = to;
                }
                that.goto(keyCount);
                // 帧计数器
                keyCount--;
                // 总量计数器
                plusCount++;
            }
            // 播放进度回调
            that.playBack && that.playBack(keyCount / imgsLen);
        };

        plusCount = 0;
        state = 'play';
        loop = !loop || loop === 'infinite' ? infinite : loop;
        // 总量
        plusNum = (to - from + 1) * loop;
        ispause = false;

        // 做一下记录
        recordFrom = from;
        recordTo = to;
        recordInf = loop;

        timeFn();
        timeMac = setInterval(timeFn, 1000 / options.fps);
    };

    this.repeatplay = function (from, to, loop, callback) {
        let that = this;
        let count = 0;

        loop = !loop || loop === 'infinite' ? infinite : loop;

        let toBack = function () {
            count++;
            if (count === loop) {
                callback && callback();
            } else {
                that.fromTo(from, to, 1, fromBack);
            }
        };

        let fromBack = function () {
            that.toFrom(to, from, 1, toBack);
        };

        this.fromTo(from, to, 1, fromBack);

    };

    this.from = function (from, loop, callback) {
        let to = imgsLen - 1;
        this.fromTo(from, to, loop, callback);
    };

    this.to = function (to, loop, callback) {
        let from = 0;
        this.fromTo(from, to, loop, callback);
    };

    this.pause = function () {
        ispause = true;
        state = 'stop';
    };

    this.play = function (callback) {
        if (state === 'play') {
            return;
        }
        if (!ispause) {
            this.fromTo(recordFrom, recordTo, recordInf, callback);
        } else {
            ispause = false;
        }
    };

    this.stop = function () {
        clearInterval(timeMac);
        state = 'stop';
        plusNum = null;
        plusCount = 0;
        ispause = false;

        // 重置纪录
        recordFrom = 0;
        recordTo = imgsLen - 1;
        recordInf = options.loop;

        drawImg(options.cover);
    };

    this.getState = function () {
        return state;
    };

    this.getLen = function () {
        return imgsLen;
    };

    this.destroy = function () {
        clearInterval(timeMac);
        timeMac = null;
        ctx = null;
        $(canvas).remove();
        canvas = null;

        for (let key in this) {
            delete this[key];
        }
    };

    init();

};

module.exports = KeyAnimation;
