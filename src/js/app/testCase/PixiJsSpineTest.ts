import * as PIXI from 'pixi.js';
import PX from '../tool/PX';
import View from '../tool/View';
import Config from '../Config';
import { getImg } from '../tool/BaseTools';
window.PIXI = PIXI;

require('../util/pixi-spine');

export class PixiJsSpineTest extends View {
    constructor () {
        super();
        PX.init(document.querySelector('.m-stage-wrap'), 1600, 750);
        $('.m-stage-wrap').fadeIn();

        new PIXI.Loader()
            // @ts-ignore
            .add({ name: 'meshSpriteReplace', url: Config.sheetDirPath + 'meshSpriteReplace.json', metadata: { spineAtlasSuffix: '.ttf' } })
            .load((loader: any, res: any) => {
                console.log(res);
                this.initSpine(res);
            });
    }

    // Spine效果测试
    private initSpine (loaderRes: any) {
        // @ts-ignore
        var animation2 = new PIXI.spine.Spine(loaderRes['meshSpriteReplace'].spineData);
        animation2.position.set(600, 375);
        animation2.scale.set(0.6);
        PX.stage.addChild(animation2);
        animation2.name = 'book';
        animation2.state.setAnimation(0, 'animation', !true);

        let skins = ['icon_lyf.png', 'skeleton-2.jpg'];
        let changeSkin = PX.addText(PX.stage, '点我贴图更换', 800, 600, 30, 'red', 'center', 400);
        changeSkin.interactive = true;
        changeSkin.on('tap', async () => {
            let img = await getImg(require('../../../img/autoLoad/' + skins[0]), true);
            // @ts-ignore
            animation2.getChildAt(0).children[0].texture = PIXI.Texture.from(img);
            animation2.state.setAnimation(0, 'animation', !true);
            skins.unshift(skins.pop());
        });
    }

    hide () {
        $('.m-stage-wrap').hide();
        PX.app.destroy(true);
    }
}
