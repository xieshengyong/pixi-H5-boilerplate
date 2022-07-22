(function (win, doc) {
    if (!win.addEventListener) return;
    var ratio = 100;  // 此处值与postcss配置中'postcss-pxtorem'的值一样
    var html = document.documentElement;
    let long, short;
    let desWidth = 1624;
    let desWidthSafe = 1200;
    let desHeight = 750;

    function setFont () {
        var resultValue;
        let isPC = !navigator.userAgent.match(/AppleWebKit.*Mobile.*/);

        if (html.clientWidth > html.clientHeight) {
            long = html.clientWidth;
            short = html.clientHeight;
        } else {
            long = html.clientHeight;
            short = html.clientWidth;
        }

        if (isPC) {
            if (long / short >= 1.77) {
                resultValue = (long * ratio / 1920).toFixed(2);
            } else {
                resultValue = (short * ratio / 1080).toFixed(2);
            }
        } else {
            if (long / short >= 2.16) {
                resultValue = (long * ratio / desWidth).toFixed(2);
            } else if (long / short <= 1.6) {
                resultValue = (long * ratio / desWidthSafe).toFixed(2);
            } else {
                resultValue = (short * ratio / desHeight).toFixed(2);
            }
        }

        if (isPC) {
            (html.className.indexOf('pc') <= -1) && (html.className += ' pc');
            html.style.fontSize = resultValue + 'px';
        } else {
            html.className = html.className.replace(' pc', '');
            if (resultValue > 114) {
                html.style.fontSize = '114px';
                (html.className.indexOf('pad') <= -1) && (html.className += ' pad');
                let wrap = document.querySelector('.m-horizontal .m-wrap');
                if (wrap) {
                    wrap.style.height = '7.5rem';
                    //  wrap.style.width = '16.24rem';
                }
            } else {
                html.style.fontSize = resultValue + 'px';
            }
        }

        // 老年模式，兼容微信右上字体调节, 不支持动态调节；
        // var htmlFontSize = parseFloat(window.getComputedStyle(html).fontSize).toFixed(2);
        // if (htmlFontSize !== resultValue) {
        //     html.style.fontSize = (resultValue / (htmlFontSize / resultValue)).toFixed(2) + 'px';
        // }
    }
    setFont();
    setTimeout(function () {
        setFont();
    }, 300);

    doc.addEventListener('DOMContentLoaded', setFont, false);
    win.addEventListener('resize', setFont, false);
    win.addEventListener('load', setFont, false);
})(window, document);
