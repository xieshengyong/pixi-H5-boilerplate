/*
 * @Author: xieshengyong
 * @Date: 2020-05-25 17:05:09
 * @LastEditTime: 2021-03-21 21:56:41
 * @LastEditors: xieshengyong
 */

/** 组件基类 */
export default class ViewController {
    private _eventPool: anyValue = {}
    private _onceEventPool: anyValue = {}

    /** 公共实例，可通过on、emit方法在不同组件间通信 */
    public instace: ViewController

    constructor (ViewInstance?: ViewController) {
        this.instace = ViewInstance;
    }

    public on (eventName: string, callback: any) {
        let pool = this._eventPool[eventName] || (this._eventPool[eventName] = []);
        pool.push(callback);
    }

    public once (eventName: string, callback: any) {
        this.on(eventName, callback);

        let oncePool = this._onceEventPool[eventName] || (this._onceEventPool[eventName] = []);
        oncePool.push(callback);
    }

    public sync (fun: (resolve: (value: unknown) => void, reject: (reason?: any) => void) => void) {
        return new Promise(fun);
    }

    public emit (eventName: string | number, data0?: any, data1?: any, data2?: any, data3?: any, data4?: any) {
        let eventCbs = this._eventPool[eventName];
        eventCbs?.forEach((element: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => void, idx: any) => {
            element(data0, data1, data2, data3, data4);
            let onceEventCbs = this._onceEventPool[eventName] || [];
            onceEventCbs.some((ele: any, index: any) => {
                if (ele === element) {
                    eventCbs.splice(idx, 1);
                    return onceEventCbs.splice(index, 1);
                }
            });
        });
    }

    public off (eventName: any, callback: any) {

    }
};
