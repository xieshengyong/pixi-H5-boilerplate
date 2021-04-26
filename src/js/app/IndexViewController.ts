/* eslint-disable no-unused-vars */
import View from './tool/View';
import PX from './tool/PX';
import Config from './Config';
import { delay, getImg, getRandom } from './tool/BaseTools';
import { util, push } from './tool/TD';

import EmitterSnow from '../../json/EmitterSnow.json'; // 粒子数据

export default class IndexViewController extends View {
    isInit: boolean;
    isSecondLoadEnd: boolean;
    mainWrap: PIXI.Container;

    private async init () {
        if (this.isInit) return;
        this.isInit = true;
        console.log('IndexViewController init');

        /* 延迟加载完成后 */
        this.instace.on('secondLoadEnd', () => {
            this.isSecondLoadEnd = true;
            $('.m-icon-loading').fadeOut(0);

            let demo3 = PX.addSprite(this.mainWrap, 'btn_share.png', 400, 400);
        });

        this.initScene();
        // await delay(0.1);
        // this.initParticeles();
        // this.goPageDownTest();
    }

    private async initScene () {
        this.mainWrap = PX.addCtn(PX.stage);

        let demo0 = PX.addSprite(this.mainWrap, '1.png', 0, 0, true);
        let demo = PX.addSprite(this.mainWrap, 'loading_bg.jpg', 0, 0, true);
        let demo1 = PX.addSprite(this.mainWrap, 'icon_lyf.png', 100, 100, true);
        demo1.anchor.set(0.5);

        demo.on('touchmove', (e: PIXI.InteractionEvent) => {
            demo1.position = PX.getRelTapPoint(e);
        });
    }

    // mesh动画贴图更换测试（翻页效果）
    goPageDownTest () {
        var animation2 = new PIXI.spine.Spine(Config.loaderRes[Config.imgPath + 'spriteSheet/meshSpriteReplace.json'].spineData);
        animation2.position.set(600, 375);
        animation2.scale.set(0.6);
        this.mainWrap.addChild(animation2);
        animation2.name = 'book';
        animation2.state.setAnimation(0, 'animation', !true);

        let skins = ['icon_lyf.png', 'skeleton-2.jpg'];
        let changeSkin = PX.addText(this.mainWrap, '贴图更换', 800, 600, 30, 'red', 'center', 400);
        changeSkin.interactive = true;
        changeSkin.on('tap', async () => {
            let img = await getImg(require('../../img/autoLoad/' + skins[0]), true);
            // @ts-ignore
            animation2.getChildAt(0).children[0].texture = PIXI.Texture.from(img);
            animation2.state.setAnimation(0, 'animation', !true);
            skins.unshift(skins.pop());
        });
    }

    // 粒子效果测试
    private initParticeles () {
        if (Config.notLoadMoreAnim) return;
        let pWrap = PX.addCtn(this.mainWrap);
        let emitterSnow = new window.Particles.Emitter(pWrap, [PIXI.Sprite.from('particle.png').texture], EmitterSnow);
        emitterSnow.emit = true;

        // @ts-ignore
        this.emitterCb && PX.app.ticker.add((dt: number) => {
            emitterSnow.update(dt * 0.016);
        });
    }

    // 检测所有资源加载完
    private checkoutLoadEnd () {
        if (this.isSecondLoadEnd) {
            return true;
        } else {
            $('.m-icon-loading').fadeIn(100);
            return false;
        }
    }

    public show (debug: boolean) {
        this.init();
    }

    public hide () {
    }
}
