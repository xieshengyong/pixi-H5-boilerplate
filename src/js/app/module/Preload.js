/*
    常规H5图片及逐帧数据加载器

    特点：
        1、支持加载字符串形式单张图片、数组形式多张图片、逐帧数据
        2、链式调用
        3、自定义缓存中图片别名
        4、缓存器 Preload.Buffer

    使用：
        var loader = new Preload.Loader('imgPath/');
        loader.add('aa.png')
            .add(['a2.png', 'a3.png'])
            .add({'name', 'a4.png'})
            .on('progress', function (p) {
                console.log(p);
            })
            .load(function () {
                console.log('succeed');
            });
*/

var Preload = {};

// window.Preload = Preload;

// 存储器
Preload.Buffer = {};

// 加载器
Preload.Loader = function (path) {
    this.path = path;
    this.loadNum = 0;
    this.loadedNum = 0;
};

var fn = Preload.Loader.prototype;

// 判断分流
fn.add = function (para) {
    if (typeof para === 'string') {
        this.loadType(para);
        this.loadNum++;
        return this;
    };
    if (para instanceof Array) {
        this.loadImgArray(para);
        this.loadNum += para.length;
        return this;
    };
    if (para instanceof Object) {
        var name = Object.getOwnPropertyNames(para)[0];
        this.loadImg(para[name], name);
        this.loadNum++;
        return this;
    };
};

// 判断分流
fn.loadType = function (para) {
    if (para instanceof Object) {
        var name = Object.getOwnPropertyNames(para)[0];
        this.loadImg(para[name], name);
        return;
    }
    if (para.indexOf('.json') === -1) {
        this.loadImg(para);
    } else {
        this.loadAjax(para);
    }
};

// 加载单个图片
fn.loadImg = function (src, name) {
    var self = this;
    var _name = name || src;
    var img = new Image();
    img.src = this.path + src;
    img.onload = img.onerror = function () {
        var imgData = {};
        imgData.image = img;
        imgData.x = img.x;
        imgData.y = img.y;
        imgData.w = img.width;
        imgData.h = img.height;
        Preload.Buffer[_name] = imgData;
        self.updateProgress();
    };
};

// 加载图片数组
fn.loadImgArray = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        this.loadType(arr[i]);
    }
};

// 加载图片json数据
fn.loadAjax = function (para) {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            self.readAjax(xhr.responseText);
        };
    };
    xhr.open('GET', this.path + para, true);
    xhr.send();
};

// 解析json数据
fn.readAjax = function (data) {
    var self = this;
    if (typeof data === 'string') {
        data = JSON.parse(data);
    };
    var img = new Image();
    img.onload = function () {
        for (var name in data.frames) {
            var imgData = {};
            imgData.image = img;
            imgData.x = data.frames[name].frame.x;
            imgData.y = data.frames[name].frame.y;
            imgData.w = data.frames[name].frame.w;
            imgData.h = data.frames[name].frame.h;
            Preload.Buffer[data.frames[name].filename] = imgData;
        };
        self.updateProgress();
    };
    img.src = this.path + data.meta.image;
};

// 加载百分比
fn.updateProgress = function () {
    this.loadedNum++;
    var p = this.loadedNum / this.loadNum * 100;
    this.updateCallBack && this.updateCallBack(Math.floor(p));
    if (p === 100) {
        this.loadCallBack && this.loadCallBack();
    }
};

// 绑定事件
fn.on = function (event, fn) {
    if (event === 'progress') {
        this.updateCallBack = fn;
    }
    return this;
};

// 加载完成
fn.load = function (fn) {
    this.loadCallBack = fn;
};

module.exports = Preload;
