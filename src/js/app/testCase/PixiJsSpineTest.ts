import PIXI from 'pixi.js';
import PX from '../tool/PX';
import View from '../tool/View';
import Config from '../Config';
import { getImg } from '../tool/BaseTools';
import Spine from 'pixi-spine';
console.log('Spine :>> ', Spine);

export default class PixiJsSpineTest extends View {
    constructor () {
        super();
        this.initSpine();
    }

    // Spine效果测试
    private initSpine () {
    //     var animation2 = new PIXI.spine.Spine(Config.loaderRes[Config.sheetDirPath + 'meshSpriteReplace.json'].spineData);
    //     animation2.position.set(600, 375);
    //     animation2.scale.set(0.6);
    //     PX.stage.addChild(animation2);
    //     animation2.name = 'book';
    //     animation2.state.setAnimation(0, 'animation', !true);

    //     let skins = ['icon_lyf.png', 'skeleton-2.jpg'];
    //     let changeSkin = PX.addText(PX.stage, '点我贴图更换', 800, 600, 30, 'red', 'center', 400);
    //     changeSkin.interactive = true;
    //     changeSkin.on('tap', async () => {
    //         let img = await getImg(require('../../../img/autoLoad/' + skins[0]), true);
    //         // @ts-ignore
    //         animation2.getChildAt(0).children[0].texture = PIXI.Texture.from(img);
    //         animation2.state.setAnimation(0, 'animation', !true);
    //         skins.unshift(skins.pop());
    //     });
    // }
}
