/*
 * @Author: xieshengyong
 * @Date: 2021-01-04 11:30:04
 * @LastEditTime: 2021-04-15 20:05:05
 * @LastEditors: xieshengyong
 */
/**
 *开发tips：
 * 1、 renderer.view.toDataURL('image/png')遇到空图片时，可以先renderer.renderer()一次；
 *
 * 2、 防止IOS序列帧动画抖动， 判读为IOS时PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
 *
 */

interface PXType {
    res: any
    app: any
    stage: PIXI.Container
    widgetPool: Array<any>
    init: Function
}

const Cache = PIXI.utils.TextureCache;

const PX = {
    res: {'': ''},
    app: {},
    stage: new PIXI.Container(),
    // widgetPool: [],

    init (canvasEl: HTMLCanvasElement, width: number, height: number) {
        var app = new PIXI.Application({
            view: canvasEl,
            width: width,
            height: height,
            transparent: true,
            backgroundColor: 0x000000
        });

        this.res = Cache;

        this.app = app;
        this.stage = app.stage;
        app.stage.interactive = true;

        this.widgetPool = [];

        const getDOMRect = () => {
            this.DOMRect = app.view.getBoundingClientRect();
            this.domStageRatio = this.app.screen.width / this.DOMRect.width;
            if (this.DOMRect.width !== 0) {
                this.app.ticker.remove(getDOMRect, this);
                this._setWidget();
            }
        };
        // 在获取到真正视口区域前不停获取
        this.app.ticker.add(getDOMRect, this);

        // 适配横竖屏变化
        const resizeStage = (e?: any) => {
            this.DOMRect = app.view.getBoundingClientRect();
            this.domStageRatio = this.app.screen.width / this.DOMRect.width;
            this._setWidget();

            var winWidth = document.documentElement.clientWidth;
            var winHeight = document.documentElement.clientHeight;
            if (e && winWidth / winHeight < 1.2 && winWidth / winHeight > 0.8) {
                return false;
            }
            if (winWidth < winHeight) {
                this.app.renderer.resize(750, 1600);
                this.app.stage.rotation = Math.PI / 2;
                this.app.stage.x = 750;
                canvasEl.style.transform = 'translate(-50%, -50%) rotate(-90deg)';
                canvasEl.style.width = '7.5rem';
                canvasEl.style.height = '16rem';
            } else {
                this.app.renderer.resize(1600, 750);
                this.app.stage.rotation = 0;
                this.app.stage.x = 0;
                canvasEl.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                canvasEl.style.height = '7.5rem';
                canvasEl.style.width = '16rem';
            }
        };
        resizeStage();
        window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', resizeStage);
    },

    getNewApp (canvasEl: any, width: any, height: any) {
        return new PIXI.Application({
            view: canvasEl || document.createElement('canvas'),
            width: width || 750,
            height: height || 1600,
            // transparent: true
            backgroundColor: 0x000000
        });
    },

    /**
     * 添加Container
     * @param {PIXI.Container} parent 父元素
     * @param {string} [name] 此元素名称
     * @return {*}  {PIXI.Container}
     */
    addCtn (parent: PIXI.Container, name?: string): PIXI.Container {
        let ctn = new PIXI.Container();
        name && (ctn.name = name);
        parent.addChild(ctn);
        return ctn;
    },

    addSprite (parent: PIXI.Container, cacheName: string, x?: number, y?: number, interactive?: boolean): PIXI.Sprite {
        let sprite = new PIXI.Sprite(Cache[cacheName]);
        sprite.position.set(x, y);
        sprite.name = cacheName;
        interactive && (sprite.interactive = true);
        parent.addChild(sprite);
        return sprite;
    },

    /**
     * 添加矩形框
     * @param {PIXI.Container} parent
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {boolean} [interactive]
     * @param {number} [alpha]
     * @param {number} [tint=0xFFFFFF] 颜色值 默认0xFFFFFF
     * @return {*}  {PIXI.Graphics}
     */
    addRect (parent: PIXI.Container, x: number, y: number, w: number, h: number, interactive?: boolean, alpha?: number, tint = 0xFFFFFF): PIXI.Graphics {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(tint, alpha || 0);
        graphics.drawRect(x, y, w, h);
        graphics.endFill();
        interactive && (graphics.interactive = true);
        parent && parent.addChild(graphics);
        return graphics;
    },

    /**
     * 添加帧动画; 序列名需从0开始，无需补位；
     *
     * 例如帧动画序列为: a_0.png, a_1.png...a_10.png，
     *
     * 则为addAnimation(parent, 'a_', '.png', 10, 0, 0)
     *
     * @param {PIXI.Container} parent 父元素
     * @param {string} preName 帧统一名称（去除序号和扩展名）
     * @param {string} fixName 扩展名
     * @param {number} num 最后一帧的序号
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {number} speed 播放速度，默认0.4（24fps）
     * @param {boolean} [loop=false]
     * @param {boolean} [play=false]
     * @param {boolean} [interactive=false]
     * @return {*}  {PIXI.AnimatedSprite}
     */
    addAnimation (parent: PIXI.Container, preName: string, fixName: string, num: number, x: number, y: number, speed = 0.4, loop = false, play = false, interactive = false): PIXI.AnimatedSprite {
        var aniFrames = [];

        for (var i = 0; i <= num; i++) {
            let texture = Cache[preName + String(i) + fixName];
            aniFrames.push(texture);
        }

        var anim = new PIXI.AnimatedSprite(aniFrames);
        anim.interactive = interactive;
        parent.addChild(anim);

        anim.animationSpeed = speed;
        anim.loop = loop || false;
        anim.position.set(x, y);
        play && anim.play();

        return anim;
    },

    addText (parent: PIXI.Container, text: string, x: number, y: number, fontSize: any, tint: any, align: any, fontWeight: any): PIXI.Text {
        let textS = new PIXI.Text(text, {
            fontSize: fontSize,
            fill: tint,
            align: align,
            fontWeight: fontWeight
        });
        textS.position.set(x, y);

        parent.addChild(textS);

        return textS;
    },

    show (target: PIXI.DisplayObject[] | PIXI.DisplayObject, duration?: number, callback?: Function, delay?: number) {
        _orderly(target, (ele: PIXI.DisplayObject) => {
            ele.alpha = 0;
            ele.visible = true;
            gsap.to(target, {
                duration: duration || 0,
                alpha: 1,
                delay: delay || 0,
                ease: 'none',
                onComplete: function () {
                    callback && callback();
                }
            });
        });
    },

    hide (target: PIXI.DisplayObject[] | PIXI.DisplayObject, duration?: number, callback?: Function, delay = 0) {
        _orderly(target, (ele: PIXI.DisplayObject) => {
            gsap.to(ele, {
                duration: duration || 0,
                alpha: 0,
                delay: delay,
                ease: 'none',
                onComplete: function () {
                    ele.visible = false;
                    callback && callback();
                }
            });
        });
    },

    /**
     * 闪烁一个节点
     * @param {*} target 节点或节点数组
     * @param {number} from opacity开始值
     * @param {number} to opacity结束值
     * @param {number} dur 总时间
     * @param {*} ease1 前半段缓动函数power1.in
     * @param {*} ease2 后半段缓动函数power1.out
     * @param {*} repeat 重复次数 默认1000
     */
    flickerNode (target: PIXI.DisplayObject[] | PIXI.DisplayObject, from: number, to: number, dur: number, ease1 = 'power1.in', ease2 = 'power1.out', repeat = 1000) {
        let anim: gsap.core.Timeline[] = [];
        _orderly(target, (node: PIXI.DisplayObject) => {
            node.visible = true;
            node.alpha = from;
            let curA = gsap.timeline()
                .to(node, { duration: dur, alpha: to, ease: 'linear' })
                .yoyo(true)
                .repeat(-1);
            anim.push(curA);
        });
        return anim;
    },

    /**
     * 上下左右浮动动画
     * @param {*} nodes 目标
     * @param {*} mx X浮动距离
     * @param {*} my Y浮动距离
     * @param {*} dur 时间 默认0.5
     * @param {*} ease1 缓动函数 默认power1.inOut
     * @param {*} ease2 缓动函数 默认power1.inOut
     * @param {*} delayTime 循环之间延时 默认0
     */
    runFloatAni (targets: PIXI.DisplayObject[] | PIXI.DisplayObject, mx: number, my: number, dur = 0.5, ease1 = 'power1.inOut', ease2 = 'power1.inOut', delayTime = 0) {
        let anim: gsap.core.Timeline[] = [];
        _orderly(targets, (target: PIXI.DisplayObject) => {
            let curA = gsap.timeline()
                .delay(delayTime)
                .to(target, { duration: dur, x: '-=' + mx, y: '-=' + my, ease: ease1 })
                .yoyo(true)
                .repeat(-1);
            anim.push(curA);
        });
        return anim;
    },

    setWidget (target: any, top: any, right: any, bottom: any, left: any) {
        this._setWidget([target, top, right, bottom, left]);
    },

    _setWidget (param: any) {
        const set = (para: any) => {
            let target = para[0];
            para[1] && (target.y = -this.DOMRect.top * this.domStageRatio + para[1]);
            // right && (target.y = (this.DOMRect.width - this.DOMRect.x) * this.domStageRatio - right);
            para[3] && (target.y = (this.DOMRect.height + this.DOMRect.top) * this.domStageRatio - para[3]);
            para[4] && (target.x = -this.DOMRect.x * this.domStageRatio + para[4]);
            console.log('this.DOMRect :>> ', this.DOMRect);
            console.log(this.DOMRect.x, this.domStageRatio);
            // TD.debug.log(2222);
            // TD.debug.log(this.DOMRect.y);
        };
        if (param) {
            set(param);
            this.widgetPool.push(param);
        } else {
            this.widgetPool.forEach((ele: any) => set(ele));
        }
    }
};

/**
 * 统一参数类型
 * @param {*} nodes
 * @param {*} callback
 */
function _orderly (nodes: PIXI.DisplayObject[] | PIXI.DisplayObject, callback: Function) {
    let nodeArr = nodes instanceof Array ? nodes : [nodes];
    nodeArr.forEach((ele: PIXI.DisplayObject) => {
        callback?.(ele);
    });
}

export default PX;
