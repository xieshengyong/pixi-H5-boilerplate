/* eslint-disable no-unused-vars */
import View from './tool/View';
import PX from './tool/PX';
import Config from './Config';
import { delay, getImg, getRandom } from './tool/BaseTools';
import { util, push } from './tool/TD';

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
        });

        this.initScene();
    }

    private async initScene () {
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

    public show () {
        this.init();
    }

    public hide () {
    }
}
