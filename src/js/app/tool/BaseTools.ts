/* eslint-disable max-params */
/*
 * 基础通用工具方法集
 * @Author: xieshengyong
 * @Date: 2020-08-27 15:05:24
 * @LastEditTime: 2021-04-20 18:58:07
 * @LastEditors: xieshengyong
 */

/**
 * 补位函数
 * @param {Number} num 数字
 * @param {*} n 位数，默认5
 */
export const pad = (num: number, n = 5): string => {
    return (Array(n).join('0') + num).slice(-n);
};

/** 获取m~n的随机数, 取整方向floor or ceil 默认floor */
export const getRandom = (m: number, n: number, isFloor = true): number => {
    return isFloor ? Math.floor(Math.random() * (n - m) + m) : Math.ceil(Math.random() * (n - m) + m);
};

/**
 * 为数字添加千位分隔符
 *  @param {number} num
 *  @param {string} dot 分隔符，默认英文逗号
 *  @example
 *   formatNum(10001) // 10,001
 *   formatNum(123456789) // 123,456,789
 */
export const formatNum = (num: number, dot = ','): string => {
    return num.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
        return s + dot;
    });
};

/**
 * delay
 * @param {number} time Unit seconds
 */
export const delay = (time: number): Promise<any> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time * 1000);
    });
};

/**
 * 深复制拷贝对象
 * @param source object
 */
export const clone = (source: any): any => {
    if (typeof source !== 'object') return source;

    let target: any;

    if (source instanceof Array) {
        target = [];
        for (let i = 0; i < source.length; i++) {
            // 避免一层死循环 a.b = a
            target[i] = source[i] === source ? target : clone(source[i]);
        }
    } else if (source instanceof Object) {
        target = {};
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                // 避免一层死循环 a.b = a
                target[key] = source[key] === source ? target : clone(source[key]);
            }
        }
    }
    return target;
};

/**
 * 深层合并对象，相同属性时，后面的覆盖前面的；
 * @param obj1 object
 * @param obj2 object
 * @example
 * const obj1 = {a: {b: 1}, b: [1,1]}
 * const obj2 = {a: {c: 3, d: 3}, b : [3]}
 * merge(obj1, obj2) // {a: {b: 1, c:3, d: 3}, b: [3]};
 */
export const merge = (obj1: any, obj2: any): object => {
    let newObj1 = clone(obj1);
    let newObj2 = clone(obj2);

    for (let key in newObj2) {
        if (newObj2.hasOwnProperty(key)) {
            if (Object.prototype.toString.call(newObj2[key]) === '[object Object]') {
                newObj1[key] = merge(newObj1[key], newObj2[key]);
            } else if (Object.prototype.toString.call(newObj2[key]) === '[object Array]') {
                if (newObj1[key]) {
                    newObj1[key] = merge(newObj1[key], newObj2[key]);
                } else {
                    newObj1[key] = newObj2[key];
                }
            } else {
                newObj1[key] = newObj2[key];
            }
        }
    }
    return newObj1;
};

/**
 * 打乱数组，返回打乱后的新数组，不改变原数组
 * @param {array} arr 目标
 * @param {number} count 指定返回数量 默认全部
 */
export const shuffleArr = (arr: Array<any>, count: number) => {
    let m = arr.length;
    let i: number;
    let min = count ? (m - count) : 0;
    while (m) {
        i = (Math.random() * m--) >>> min;
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr.slice(min);
};

/**
 * 获取在一定范围内不重复的坐标，默认只计算500次，需合理指定范围
 * @param {array} start 起始坐标 [0, 0]
 * @param {array} end 结束坐标 [100, 100]
 * @param {array} notSamePool 不重复坐标数组 [[1, 1], [1, 2]]
 * @param {number} xRange x方向不重合范围`
 * @param {number} yRange y不重合范围
 */
export const getNotSamePosition = (start: number[], end: number[], notSamePool: any[], xRange: number, yRange: number) => {
    let isSame = true;
    let pos: number[];
    let time = 0;
    while (isSame && (time < 500)) {
        pos = [getRandom(start[0], end[0]), getRandom(start[1], end[1])];
        isSame = notSamePool.find(ele => {
            if (Math.abs(pos[0] - ele[0]) < xRange || Math.abs(pos[1] - ele[1]) < yRange) {
                return true;
            }
            return false;
        });
        time++;
    }
    time === 500 && console.error('范围指定不合理！运算超过500次');
    return pos;
};

export function getWinSize ():{width:number, height:number} {
    let winSize = document.documentElement;
    return {
        width: winSize.clientWidth,
        height: winSize.clientHeight
    };
}

export function saveLocalData (key: string | number, data: any) {
    localStorage[key] = data;
}

export function getLocalData (key: string | number) {
    return localStorage[key];
}

export function getQuery (name: string, target = location.search) {
    let m = target.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
    return !m ? '' : m[2];
}

export function getCanvas (width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    return [canvas, ctx];
};

export function getImg (src: string, anonymous = false): any {
    return new Promise((resolve, reject) => {
        let img = new Image();
        anonymous && (img.crossOrigin = 'Anonymous');
        img.src = src;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = () => reject;
    });
};

export function getJs (src: any) {
    return new Promise<void>((resolve, reject) => {
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        document.body.appendChild(script);
        script.onload = () => {
            resolve();
        };
        script.src = src;
    });
};
