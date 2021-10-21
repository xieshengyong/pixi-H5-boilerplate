var fs = require('fs');

let curFile = 'dist/a20210728infinite/';

fs.readdirSync(curFile).forEach((ele) => {
    if (ele.indexOf('html') <= -1) return;
    fs.readFile(curFile + ele, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        var result = data.replace('<!--表单内容主体模板-->', '<!--表单内容主体模板--><script id="tpl_tbody_790010" type="text/tempalate">    {if (pageData.iRet!="0")}<tr><td colspan="3" class="not-available">${pageData.sMsg}</td></tr>    {else}        {for giftInfo in pageData.myGiftList}<tr><td><p class="r2">${giftInfo.sPackageName}</p></td><td><p class="r3">                    {if (LOTTERY_CFG[giftInfo.iPackageId].t === 1)}                        {if (giftInfo.iStatus != "3")}                            ${giftInfo.sAreaName}                        {/if}                        {if (giftInfo.iStatus == "3")}<a href="javascript:actObj.readyToReceive(${giftInfo.id});" class="server">未领取</a>                        {/if}                    {else if (LOTTERY_CFG[giftInfo.iPackageId].t === 2)}<a href="javascript:actObj.readyToReceive(${giftInfo.id});" class="server">修改地址</a>                    {/if}</p></td><td><p class="r1">${giftInfo.dtGetPackageTime}</p></td></tr>        {forelse}<tr><td colspan="3" class="not-available">您尚未获得任何礼包</td></tr>        {/for}    {/if}</script><script id="tpl_tfoot_790010" type="text/tempalate"><tr><td class="page" colspan="3"><a href="javascript:;" id="prevbtn_790010" class="prev">上一页</a><span><em class="now_page" id="currPage_790010">${pageData.pageNow}</em> /<em class="total_page" id="totalPage_790010">${pageData.pageTotal}</em></span><a href="javascript:;" id="nextbtn_790010" class="next">下一页</a></td></tr></script>');

        fs.writeFile(curFile + ele, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
});
