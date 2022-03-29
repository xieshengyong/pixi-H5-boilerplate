import PIXI from 'pixi.js';
import PX from '../tool/PX';
import View from '../tool/View';

import EmitterSnow from '../../../json/EmitterSnow.json'; // 粒子数据

export default class Shader extends View {
    constructor () {
        super();
        this.initParticeles();
    }

    // 粒子效果测试
    private initParticeles () {
        let pWrap = PX.addCtn(PX.stage);
        let emitterSnow = new window.Particles.Emitter(pWrap, [PIXI.Sprite.from('particle.png').texture], EmitterSnow);
        emitterSnow.emit = true;

        // @ts-ignore
        this.emitterCb && PX.app.ticker.add((dt: number) => {
            emitterSnow.update(dt * 0.016);
        });
    }
}
