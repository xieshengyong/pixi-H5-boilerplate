/* eslint-disable no-unused-expressions */
/* eslint-disable one-var */
/* eslint-disable no-redeclare */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/** 自定义select选择器
 * 
 * 使用方法
 * HTML: <div id="plat" class="select sys abcter"></div>
 * CSS: any
 * JS:
    var s1 = $('#plat').selectModel({
        optionClick: function (e: any) {
            console.log(e);
        },
        defaultIndex: 2, //默认显示第几个
        optionData: [{
            name: '魔兽世界',
            value: '1'
        }, {
            name: '热血江湖',
            value: '2'
        }, {
            name: '神鬼传奇',
            value: '3'
        }, {
            name: '大话西游',
            value: '4'
        }, {
            name: 'QQ幻想世界',
            value: '5'
        }]
    });
 */
;
(function ($) {
    function SelectModel (ele, params) {
        this.ele = ele;
        this.params = params;
        this.optionClick = params.optionClick;//点击菜单中的每一项的回调函数
        this.init();
        this.keyboardEvent();
        this.optionMenuHide();
    }
    $.fn.selectModel = function (params) {
        return new SelectModel(this[0], params);
    };
    SelectModel.prototype = {
        constructor: SelectModel,
        init: function () {
            //optionData 下拉框数据
            var me = this;
            var optionData = me.params.optionData;
            if (!optionData.length) return;
            //默认显示选择后的dom
            var selectBox = document.createElement('div');
            var selectDefault = document.createElement('div');
            //下拉box
            var optionBox = document.createElement('div');
            var option_ul = document.createElement('ul');
            option_ul.className = 'selectUl';
            optionBox.className = 'selectOptions select_2017_05_05';
            selectBox.className = 'selectBox selectBox_master_wz';
            selectDefault.className = 'selectDefault';
            selectDefault.innerHTML = '请选择';
            this.params.defaultIndex = this.params.defaultIndex || 0;
            selectDefault.innerHTML = this.params.optionData[this.params.defaultIndex].name;
            selectDefault.setAttribute('value', this.params.optionData[this.params.defaultIndex].value);
            selectDefault.setAttribute('tabindex', 0);//目的为了让div 有聚焦 不然无法触发keyboardEvent
            var li_str = '',
                activeClass = '';
            for (var i = 0, len = optionData.length; i < len; i++) {
                activeClass = i == me.params.defaultIndex ? 'active' : '';
                li_str += '<li value="' + optionData[i].value + '" class="' + activeClass + '">' + optionData[i].name + '</li>';
            }
            option_ul.innerHTML = li_str;
            optionBox.appendChild(option_ul);
            selectBox.appendChild(selectDefault);
            optionBox.style.display = 'none';
            selectBox.appendChild(optionBox);
            //清空
            if (me.ele.getElementsByClassName('selectBox_master_wz').length) {
                me.ele.innerHTML = '';
            }
            me.ele.appendChild(selectBox);
            //点击select
            this.selectClick();
        },
        selectClick: function () {
            //点击渲染菜单
            var me = this;
            var select = me.ele.getElementsByClassName('selectDefault')[0];
            var options = select.nextSibling; //下拉box
            var ul_select = options.getElementsByClassName('selectUl')[0];
            var li_options = ul_select.getElementsByTagName('li');
            var resultObj = {};
            //点击显示隐藏菜单 并且定位到相应的item
            select.onclick = function (e) {
                me.stopPropagation(e);
                /**
                 * --多个select时点击展开一个隐藏另外所有的select的展开内容
                 * -- showingMenu标记多个select时展开菜单的那个sleect
                 */
                var allSelectObjs = document.getElementsByClassName('select_2017_05_05');
                if (allSelectObjs.length > 1) {
                    for (var i = 0, len = allSelectObjs.length; i < len; i++) {
                        allSelectObjs[i].style.display = 'none';
                        allSelectObjs[i].removeAttribute('showingMenu');
                    }
                }
                options.style.display = options.style.display == 'none' ? 'block' : 'none';
                options.setAttribute('showingMenu', true);
                for (var i = 0, len = li_options.length; i < len; i++) {
                    li_options[i].className = '';
                    if (li_options[i].innerHTML == this.innerHTML) {
                        li_options[i].className = 'active';
                    }
                }
            };
            //菜单中 每个li 绑定事件
            for (var i = 0, len = li_options.length; i < len; i++) {
                li_options[i].onclick = function () {
                    select.innerHTML = this.innerHTML;
                    select.setAttribute('value', this.value); //设置value属性
                    options.style.display = 'none'; //隐藏下拉菜单
                    this.className = 'active';
                    resultObj.name = this.innerHTML;
                    resultObj.value = this.value;
                    me.returnSelectedResult(resultObj);
                };
                li_options[i].onmouseover = function () {
                    for (var i = 0, len = li_options.length; i < len; i++) {
                        li_options[i].className = '';
                    }
                    this.className = 'active';
                };
                li_options[i].onmouseout = function (e) {
                    this.className = '';
                };
            }
            //鼠标划出菜单 最后划过的保持选中状态
            ul_select.onmouseout = function (e) {
                for (var i = 0, len = li_options.length; i < len; i++) {
                    if (e.target.innerHTML == li_options[i].innerHTML) {
                        li_options[i].className = 'active';
                    }
                }
            };
            //键盘事件
            select.onkeydown = function (e) {
                me.keyboardEvent(e);
            };
        },
        optionMenuHide: function (e) {
            //隐藏菜单
            var me = this;
            document.onclick = function (e) {
                me.stopPropagation(e);
                var new_me = null;//当前展开菜单的对象this
                /**
                 * - 多个select时 me会是最后一个select
                 * - 为了避免 不能点击document 隐藏除了最后一个的select
                 * - 需要通过标识 去获取正在展开菜单的select
                 */
                var selectObjs = document.getElementsByClassName('select_2017_05_05');
                if (selectObjs.length) {
                    for (var i = 0, len = selectObjs.length; i < len; i++) {
                        if (selectObjs[i].hasAttribute('showingMenu')) {
                            new_me = selectObjs[i].parentNode.parentNode;
                        }
                    }
                    if (new_me) new_me.getElementsByClassName('selectOptions')[0].style.display = 'none';
                }
            };
        },
        returnSelectedResult: function (params) {
            //option click事件
            var me = this;
            if (typeof me.optionClick == 'function') {
                me.optionClick(params);
            }
        },
        stopPropagation: function (e) {
            //window.event  e.cancelBubble 适配 IE
            e = e || window.event;
            e.stopPropagation ? e.stopPropagation() : (e.cancelBubble == true);
        },
        keyboardEvent: function (e) {
            //键盘事件 up down enter
            if (!e) return;
            var me = this;
            var li_options = me.ele.getElementsByTagName('li');
            var select = me.ele.getElementsByClassName('selectDefault')[0];
            var li_data = me.params.optionData;
            var keyCode = e.keyCode;
            var hasActiveItem = me.ele.getElementsByClassName('active')[0];
            switch (keyCode) {
                case 40://down
                    //最后一个的时候 return
                    if (hasActiveItem.innerHTML == li_data[li_data.length - 1].name) return;
                    for (var i = 0, len = li_options.length; i < len; i++) {
                        li_options[i].className = '';
                    }
                    var nextItem = hasActiveItem.nextSibling;
                    nextItem.className = 'active';
                    break;
                case 38://up
                    //到第一个的时候 return
                    if (hasActiveItem.innerHTML == li_data[0].name) return;
                    for (var i = 0, len = li_options.length; i < len; i++) {
                        li_options[i].className = '';
                    }
                    var prevItem = hasActiveItem.previousSibling;
                    prevItem.className = 'active';
                    break;
                case 13://enter
                    var hasActive_attr = hasActiveItem.getAttribute('value');
                    select.innerHTML = hasActiveItem.innerHTML;
                    select.setAttribute('value', hasActive_attr);
                    li_options[0].parentNode.parentNode.style.display = 'none';
                    break;
                case 27://esc
                    me.ele.getElementsByClassName('selectOptions')[0].style.display = 'none';
                    break;
                default:
                    break;
            }
        }
    };
})($);
