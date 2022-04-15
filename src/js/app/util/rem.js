(function (win, doc) {
    if (!win.addEventListener) return;
    var ratio = 100;  // 此处值与postcss配置中'postcss-pxtorem'的值一样
    var html = document.documentElement;
    let long, short;

    function setFont () {
        var resultValue;

        console.log(html.clientWidth, html.clientHeight);
        if (html.clientWidth > html.clientHeight) {
            long = html.clientWidth;
            short = html.clientHeight;
        } else {
            long = html.clientHeight;
            short = html.clientWidth;
        }

        if (long / short >= 2.16) {
            resultValue = (long * ratio / 1624).toFixed(2);
            console.log(1);
        } else if (long / short <= 1.6) {
            resultValue = (long * ratio / 1200).toFixed(2);
            console.log(2);
        } else {
            resultValue = (short * ratio / 750).toFixed(2);
            console.log(3);
        }

        if (resultValue > 114) {
            html.style.fontSize = '114px';
            (html.className.indexOf('pad') <= -1) && (html.className += ' pad');
            let wrap = document.querySelector('.m-horizontal .m-wrap');
            if (wrap) {
                wrap.style.height = '7.5rem'; wrap.style.width = '16.24rem';
            }
        } else {
            html.style.fontSize = resultValue + 'px';
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
