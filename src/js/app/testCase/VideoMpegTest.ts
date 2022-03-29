/*
 * @Author: xieshengyong
 * @Date: 2022-01-17 14:38:07
 * @LastEditTime: 2022-03-29 16:08:56
 * @LastEditors: xieshengyong
 */

import View from '../tool/View';
import MediaSprite from '../tool/MediaSprite';

export default class VideoMpeg extends View {
    constructor () {
        super();
        let player = new MediaSprite([{
            element: document.querySelector('#video'),
            src: require('../../../media/video.mp4')
        }, {
            element: document.querySelector('#canvas'),
            src: require('../../../media/v.ttf')
        } ], [
            {
                name: 'a2',
                time: 5
            },
            {
                name: 'a1',
                time: 2
            }
        ]);

        $('body').click(() => {
            console.log('player :>> ', player.media);
            player.play();
        });

        player.on('a1', (ti: number) => {
            console.log('a1', ti);
            player.pause();
            $('body').click(() => {
                player.play();
            });
        });
        player.on('a2', (ti: number) => {
            console.log('a2', ti);
            player.gotoAndPlay(1.9);
            // @ts-ignore
            // player.nextFrame();
        });

        // player.onStalled(() => {
        //     // window.showLoading(true);
        // })

        // player.onContinue(() => {
        //     // window.showLoading(false);
        // })
    }
};
