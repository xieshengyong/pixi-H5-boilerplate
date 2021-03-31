/* eslint-disable no-unused-vars */
import ViewController from './tool/ViewController';
import PX from './tool/PX';
import Config from './Config';
import { delay, getRandom } from './tool/BaseTools';
import { util, push } from './tool/TD';
import EmitterSnow from '../../json/EmitterSnow.json';

export default class IndexViewController extends ViewController {
    isInit: boolean;
    isSecondLoadEnd: boolean;
    emitterCb: (dt: number) => void;
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
        await delay(0.1);
        this.initParticeles();
    }

    private initScene () {
        this.mainWrap = PX.addCtn(PX.stage);

        let demo1 = PX.addSprite(this.mainWrap, 'icon_lyf.png', 100, 100);
        let demo2 = PX.addSprite(this.mainWrap, 'icon_drj.png', 200, 100);
    }

    private initParticeles () {
        if (Config.notLoadMoreAnim) return;
        let pWrap = PX.addCtn(this.mainWrap);
        let emitterSnow = new window.Particles.Emitter(pWrap, [PIXI.Sprite.from('particle.png').texture], EmitterSnow);
        emitterSnow.emit = true;

        this.emitterCb = (dt: number) => {
            emitterSnow.update(dt * 0.016);
        };
        // @ts-ignore
        this.emitterCb && PX.app.ticker.add(this.emitterCb);
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