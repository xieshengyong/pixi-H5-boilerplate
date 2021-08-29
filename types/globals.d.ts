
interface PlaceDataType {
    [propName: string]: PlaceDataChildType
}

interface PlaceDataChildType {
    isInit: Boolean
    isDraw2?: Boolean
    wrap: any
    _children?: {
        [propName: string]: PIXI.DisplayObject
    }
    draw: Array<{ alias?: String, type?: string, cacheName?: String, x?: Number, y?: Number, frameNum?: Number, speed?: Number, loop?: Boolean, autoPlay?: Boolean, interactive?: Boolean }>,
    draw2?: Array<{ alias?: String, type?: string, cacheName?: String, x?: Number, y?: Number, frameNum?: Number, speed?: Number, loop?: Boolean, autoPlay?: Boolean, interactive?: Boolean }>,
    init: Function
    init2?: Function
    preshow?: Function
    show: Function
    hide: Function
}

interface Window {
    lloogg: any;
}
