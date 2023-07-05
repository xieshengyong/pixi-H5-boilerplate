/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js';
import PX from '../tool/PX';
import View from '../tool/View';
import Config from '../Config';
import { getImg } from '../tool/BaseTools';
window.PIXI = PIXI;

export class PixiJsScaleModes extends View {
    constructor () {
        super();
        PX.init(document.querySelector('.m-stage-wrap'), 1600, 750);
        $('.m-stage-wrap').fadeIn();

        new PIXI.Loader()
            // @ts-ignore
            .add({ name: 'icon_lyf', url: require('../../../img/autoLoad/3.png') })
            .add({ name: 'icon_lyf2', url: require('../../../img/autoLoad/3.png') })
            .load((loader: any, res: any) => {
                console.log(res);
                this.init(res);
            });
    }

    // Spine效果测试
    private init (loaderRes: any) {
        PX.res['icon_lyf'].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        let img1 = PX.addSprite(PX.stage, 'icon_lyf', 100, 100);
        img1.scale.set(8);
        let img2 = PX.addSprite(PX.stage, 'icon_lyf2', 800, 100);
        img2.scale.set(8);
    }

    hide () {
        $('.m-stage-wrap').hide();
        PX.app.destroy(true);
    }
}
