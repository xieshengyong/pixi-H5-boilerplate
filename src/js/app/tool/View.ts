/*
 * @Author: xieshengyong
 * @Date: 2020-05-25 17:05:09
 * @LastEditTime: 2022-03-29 15:42:58
 * @LastEditors: xieshengyong
 */

/** 组件基类 */
export default class View {
    private _eventPool: any = {}

    /** 公共实例，可通过on、emit方法在不同组件间通信 */
    public instance: View

    constructor () {
        this.instance = ViewInstance;
    }

    public on (eventName: string, callback: Function, once = false) {
        let pool = this._eventPool[eventName] || (this._eventPool[eventName] = []);
        pool.push({ cb: callback, once: once });
    }

    public once (eventName: string, callback: Function) {
        this.on(eventName, callback, true);
    }

    public sync (fun: (resolve: (value: unknown) => void, reject: (reason?: any) => void) => void) {
        return new Promise(fun);
    }

    public emit (eventName: string | number, data0?: any, data1?: any, data2?: any, data3?: any, data4?: any) {
        let eventCbs = this._eventPool[eventName];
        if (!eventCbs) return;
        for (let index = 0; index < eventCbs.length; index++) {
            const ele = eventCbs[index];
            ele.cb(data0, data1, data2, data3, data4);
            if (ele.once) {
                eventCbs.splice(index, 1);
                index--;
            }
        }
    }

    public off (eventName: string | number, callback?: Function) {
        if (!callback) {
            this._eventPool[eventName] = null;
            return;
        }
        let eventCbs = this._eventPool[eventName];
        eventCbs?.forEach((ele: any, index: number) => {
            if (ele.cb === callback) {
                eventCbs.splice(index, 1);
            }
        });
    }
};

const ViewInstance = new View();
