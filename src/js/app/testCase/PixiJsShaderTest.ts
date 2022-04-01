import * as PIXI from 'pixi.js';
import PX from '../tool/PX';
import View from '../tool/View';

window.PIXI = PIXI;

export class PixiJsShaderTest extends View {
    constructor () {
        super();
        PX.init(document.querySelector('.m-stage-wrap'), 1600, 750);
        $('.m-stage-wrap').fadeIn();

        new PIXI.Loader()
            // @ts-ignore
            .add('1', require('../../../img/autoLoad/1.png'))
            .load((loader: any, res: any) => {
                console.log(res);
                this.colorShader();
            });
    }

    colorShader () {
        let demo0 = PX.addSprite(PX.stage, '1', 0, 0, true);
        let shader = `
            precision mediump float;

            varying vec2 vTextureCoord;
            varying vec4 vColor;

            uniform sampler2D uSampler;
            uniform float customUniform;

            void main(void)
            {
                vec2 uvs = vTextureCoord.xy;

                vec4 fg = texture2D(uSampler, vTextureCoord);


                fg.r = uvs.y + sin(customUniform);

                // fg.r = clamp(fg.r,0.0,0.9);

                gl_FragColor = fg;

            }
        `;
        let filter = new PIXI.Filter(null, shader, {
            customUniform: 0.25
        });

        demo0.filters = [filter];
    }

    hide () {
        $('.m-stage-wrap').hide();
        PX.app.destroy(true);
    }
};
