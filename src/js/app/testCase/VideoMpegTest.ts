/*
 * @Author: xieshengyong
 * @Date: 2022-01-17 14:38:07
 * @LastEditTime: 2022-01-17 17:59:50
 * @LastEditors: xieshengyong
 */

import View from "../tool/View";
import MediaSprite from '../tool/MediaSprite';
import '../util/jsmpeg.min.js';

export default class VideoMpeg extends View {
    constructor() {
        super()
        let player = new MediaSprite([{
            element: document.querySelector('#video'),
            src: require('../../../media/video.mp4')
        }, {
            element: document.querySelector('#canvas'),
            src: require('../../../media/mpegtest.ttf')
        },], [{
            name: 'ad',
            time: 1
        }])

        $('body').click(() => {
            console.log('player :>> ', player.media);
            player.play();
        })

        player.onStalled(() => {
            window.showLoading(true);
        })

        player.onContinue(() => {
            window.showLoading(false);
        })
    }
};
