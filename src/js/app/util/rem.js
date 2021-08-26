(function (win, doc) {
    if (!win.addEventListener) return;
    var rootValue = 100;  // 此处值与postcss配置中'postcss-pxtorem'的值一样
    var html = document.documentElement;

    function setFont () {
        var k = 750;
        var scale = html.clientWidth / k;
        window.scaleNum = scale;
        var resultValue = (scale * rootValue).toFixed(2);

        if (html.clientWidth > html.clientHeight) {
            if (html.clientWidth / html.clientHeight <= 1.926) {
                resultValue = html.clientWidth / 1310;
            } else {
                resultValue = html.clientHeight / 680;
            }
        }

        if (resultValue > 80) {
            html.style.fontSize = '80px';
            (html.className.indexOf('pad') <= -1) && (html.className += ' pad');
        } else {
            html.style.fontSize = resultValue + 'px';
        }
        // console.log(html.clientHeight / k);
        document.querySelectorAll('.scale-dom').forEach((dom) => {
            dom.style.webkitTransform = 'scale(' + scale + ')';
            dom.style.transform = 'scale(' + scale + ')';
        });

        // 老年模式，兼容微信右上字体调节, 不支持动态调节；
        var htmlFontSize = parseFloat(window.getComputedStyle(html).fontSize).toFixed(2);
        if (htmlFontSize !== resultValue) {
            html.style.fontSize = (resultValue / (htmlFontSize / resultValue)).toFixed(2) + 'px';
        }
    }
    setFont();
    setTimeout(function () {
        setFont();
    }, 300);

    doc.addEventListener('DOMContentLoaded', setFont, false);
    win.addEventListener('resize', setFont, false);
    win.addEventListener('load', setFont, false);
})(window, document);
