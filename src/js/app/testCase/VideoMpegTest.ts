/*
 * @Author: xieshengyong
 * @Date: 2022-01-17 14:38:07
 * @LastEditTime: 2022-04-01 16:39:41
 * @LastEditors: xieshengyong
 */

import View from '../tool/View';
import MediaSprite from '../tool/MediaSprite';

export class VideoMpegTest extends View {
    hide: () => void;

    constructor () {
        super();
        $('.m-index').fadeIn();

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

        $('.m-index').one('click', () => {
            player.play();
        });

        player.on('a1', (ti: number) => {
            console.log('a1', ti);
            player.pause();
            $('.m-index').one('click', () => {
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

        this.hide = () => {
            player.pause();
            $('.m-index').fadeOut();
        };
    }
};
