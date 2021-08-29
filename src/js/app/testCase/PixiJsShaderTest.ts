import PX from '../tool/PX';
import View from '../tool/View';

export default class Shader extends View {
    constructor () {
        super();
        this.colorShader();
    }

    colorShader () {
        let demo0 = PX.addSprite(PX.stage, '1.png', 0, 0, true);
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
};
