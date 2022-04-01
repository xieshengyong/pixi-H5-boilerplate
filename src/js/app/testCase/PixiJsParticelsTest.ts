import * as PIXI from 'pixi.js';
import PX from '../tool/PX';
import View from '../tool/View';
import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import EmitterSnow from '../../../json/EmitterSnow.json'; // 粒子数据

window.PIXI = PIXI;

export class PixiJsParticelsTest extends View {
    constructor () {
        super();
        PX.init(document.querySelector('.m-stage-wrap'), 1600, 750);
        $('.m-stage-wrap').fadeIn();

        new PIXI.Loader()
            .add('particle', require('../../../img/autoLoad/particle.png'))
            .load((loader: any, res: any) => {
                console.log(res);
                this.initParticeles();
            });
    }

    // 粒子效果测试
    private initParticeles () {
        let pWrap = PX.addCtn(PX.stage);
        let emitterSnow = new Emitter(pWrap, upgradeConfig(EmitterSnow, [PIXI.Sprite.from('particle').texture]));
        emitterSnow.emit = true;

        PX.app.ticker.add((dt: number) => {
            emitterSnow.update(dt * 0.016);
        });
    }

    hide () {
        $('.m-stage-wrap').hide();
        PX.app.destroy(true);
    }
}
