/*
    PituBridge.js
    version 1.0
    for ttpic v2.7
    create at 2015/06 by billzbwang
*/

if (!window.PituBridge) {
    (function(){
        function getShareInfo() {
            var $shareBtn = $("#shareBtn");
            if ($shareBtn.length > 0) {
                var shareData = $shareBtn.attr("shareData");
                if (shareData.length > 0) {
                    return shareData;
                }
            }
            return "";
        }

        var PituBridge = function(){
            this.registeredCallback = null;
            this.lastInvokeTime = 0;

            this.isAndroid = false;
            var ua = navigator.userAgent;
            if (/Android (\d+\.\d+)/.test(ua)){
                this.isAndroid = true;
            }
        }
        PituBridge.prototype.getShareInfo = getShareInfo;
        PituBridge.prototype.invokeNative = function(path, params, callback) {
            var curDate = new Date();
            var curTime = curDate.getTime();
            if (curTime - this.lastInvokeTime < 1000) {
                return;
            }
            this.lastInvokeTime = curTime;
            this.registeredCallback = callback;

            if (!params) {
                params = {invokeTime:curTime};
            } else {
                params["invokeTime"] = curTime;
            }
            var paramList = [];
            for (var pKey in params) {
                var pVal = params[pKey];
                paramList.push([pKey, encodeURIComponent(pVal)].join("="));
            }
            var query = paramList.join("&");

            var commandSrc = ["content://com.tencent.ttpic.jsbridge/", path, "?", query].join("");

            if (this.isAndroid){
                console.log(commandSrc);
            } else {
                var commandImg = new Image();
                commandImg.src = commandSrc;
                commandImg = null;
            }
        }
        // params definition
        // errCode:optional, error code
        // errMsg:optional, error message
        // imgData:optional, img`s base64str
        // imgUrl:optional, img url for h5 img.src
        // isGif:required, 1 if image is gif; 0 if image isn't gif
        // originImageDataCallback:optional, method name of a function which return img`s base64str
        // sharePlatform:required, choose one from [QzoneImage, QzoneLink, MomentLink, MomentImage, Wechat, WechatImage, Sina, SinaImage, FBLink, FBImage, twitterLink, twitterImage, instagram, QQImage, QQLink, QQLinkURL, TencentWeibo]

        PituBridge.prototype.nativeCallback = function(params) {
            if (!params.invokeTime || params.invokeTime != this.lastInvokeTime) {
                return;
            }

            if (this.registeredCallback) {
                this.registeredCallback(params);
            }
        }
        PituBridge.prototype.openInternal = function(url, callback) {
            var invokeParams = {url:url};
            this.invokeNative("openInternal", invokeParams, callback);
        }
        PituBridge.prototype.openExternal = function(url) {
            var invokeParams = {url:url};
            this.invokeNative("openExternal", invokeParams);
        }
		// params definition
		// ifFrontCamera:optional, 1表示开启前置摄像头
        PituBridge.prototype.chooseImage = function(params, callback) {
            this.invokeNative("chooseImage", params, callback);
        }
        // params definition
        // url:requied, image url
        // dataCallback:optional, method name of a function which return img`s base64str
        // imgData:optional, img`s base64str
		// nativeToast:是否弹结果toast，0不弹，1弹
        PituBridge.prototype.saveImage = function(params, callback) {
            this.invokeNative("saveImage", params, callback);
        }

        PituBridge.prototype.shareLink = function(params, callback) {
            this.invokeNative("shareLink", params, callback);
        }

        PituBridge.prototype.shareImage = function(params, callback) {
            this.invokeNative("shareImage", params, callback);
        }

        // params definition
        // title:required, share title
        // desc:required, share description
        // summary:optional, share summary for QZone only, not useful commonly
        // url:required, share url of the web page
        // imageUrl:required, thumb image url
        // imageDataCallback:optional, method name of a function which return img`s base64str
        // originImageUrl:required, origin image url
        // originImageDataCallback:optional, method name of a function which return img`s base64str
        // platforms:optional, [Qzone, QzoneImage, QzoneLink, MomentLink, MomentImage, Wechat, WechatImage, Sina, SinaImage, FBLink, FBImage, twitterLink, twitterImage, instagram, QQImage, QQLink, QQLinkURL, TencentWeibo]
        // tag:optional, share tag for image share
        PituBridge.prototype.share = function(params, callback) {
            this.invokeNative("share", params, callback);
        }
        PituBridge.prototype.getImageBase64Data = function(imgDom, imgSize) {
            var dataURL = "";
            var mCanvas = document.createElement('canvas');
            if (imgSize && imgSize.width && imgSize.height) {
                mCanvas.width = imgSize.width;
                mCanvas.height = imgSize.height;
            } else {
                mCanvas.width = imgDom.width;
                mCanvas.height = imgDom.height;
            }
            var mCtx = mCanvas.getContext('2d');
            if (mCtx) {
                mCtx.drawImage(imgDom, 0, 0, mCanvas.width, mCanvas.height);

                if (this.isAndroid){
                    if (window.JPEGEncoder) {
                        var imgEncoder = new JPEGEncoder();
                        dataURL = imgEncoder.encode(mCtx.getImageData(0, 0, mCanvas.width, mCanvas.height), 100, true);
                        imgEncoder = null;
                    } else {
                        dataURL = mCanvas.toDataURL("image/png");
                    }
                } else {
                    dataURL = mCanvas.toDataURL("image/jpeg", 1.0);
                }
                var flagIndex = dataURL.indexOf(",");
                if (flagIndex >= 0) {
                    dataURL = dataURL.substr(flagIndex+1);
                }
            }
            mCanvas = null;
            return dataURL;
        }
        
        window.PituBridge = new PituBridge();
    })();
}
