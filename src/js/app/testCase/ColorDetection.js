const colorRgb = function (target) {
    let sColor = target.toLowerCase();
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = '#';
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
        }
        // return 'RGB(' + sColorChange.join(',') + ')';
        return sColorChange;
    }
    return sColor;
};

function abs5 (a, b) {
    return Math.abs(a - b) < 5;
}

// const colorSrc = require('../../../img/color.jpg');
const colorSrc = 'https://gw.alicdn.com/imgextra/i2/O1CN01sCJYhj1s7oGnYBhWK_!!6000000005720-0-tps-750-960.jpg';

export class ColorDetection {
    constructor () {
        let img = new Image();
        img.src = colorSrc;
        img.style.width = '7.5rem';
        img.style.position = 'absolute';
        img.style.zIndex = '10';
        img.style.top = '50%';
        img.style.marginTop = '-4.8rem';
        document.body.append(img);
        document.querySelector('.m-horizontal').style.display = 'none';

        // 色块
        // 1、商品橱窗  热区：#FF0000，锚点：#FFFF00
        // 2、店铺故事 热区：#FF7D00，锚点：#00FF00
        // 3、活动 热区：#0000FF，锚点：#00FFFF
        // 4、进店逛逛 热区：#FF00FF，锚点：#9CFF00

        // 锚点
        let colors = [
            colorRgb('#FFFF00'),
            colorRgb('#00FF00'),
            colorRgb('#00FFFF'),
            colorRgb('#9CFF00')
        ];
        this.colorFindPos(colorSrc, colors).then((pos) => {
            console.log('pos :>> ', pos);
        });

        let ratio = 750 / window.innerWidth;
        let matchTest = async (e) => {
            let ismatch = await this.colorDetection(colorSrc, [e.offsetX * ratio, e.offsetY * ratio], [
                colorRgb('#00FFFF'),
                colorRgb('#0000FF')]);
            console.log('ismatch :>> ', ismatch);
        };
        img.addEventListener('click', matchTest);

        this.hide = () => {
            document.documentElement.removeEventListener('click', matchTest);
            document.body.removeChild(img);
        };
    }

    colorDetection (imgSrc, posXY, colors) {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let img = new Image();
            let isMatch = false;

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                detecion();
            };
            img.crossOrigin = 'Anonymous';
            img.src = imgSrc;

            function detecion () {
                let data = ctx.getImageData(posXY[0], posXY[1], 1, 1);
                const element1 = data.data[0];
                const element2 = data.data[1];
                const element3 = data.data[2];

                colors.forEach((ele) => {
                    if (abs5(element1, ele[0]) && abs5(element2, ele[1]) && abs5(element3, ele[2])) {
                        isMatch = true;
                    }
                });
                resolve(isMatch);
            }
        });
    }

    colorFindPos (imgSrc, colors, gap) {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let _gap = gap || 5;
            let img = new Image();
            let result = new Array(colors.length);

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                find();
            };
            img.crossOrigin = 'Anonymous';
            img.src = imgSrc;

            function find () {
                for (let dx = 0; dx < canvas.width; dx += _gap) {
                    for (let dy = 0; dy < canvas.height; dy += _gap) {
                        let data = ctx.getImageData(dx, dy, 1, 1);
                        const element1 = data.data[0];
                        const element2 = data.data[1];
                        const element3 = data.data[2];
                        colors.forEach((ele, idx) => {
                            if (abs5(element1, ele[0]) && abs5(element2, ele[1]) && abs5(element3, ele[2])) {
                                result[idx] = [dx, dy];
                            }
                        });
                    }
                }
                resolve(result);
            }
        });
    }

    hide () {

    }
};
