/*
 * @Author: xieshengyong
 * @Date: 2021-12-16 19:45:23
 * @LastEditTime: 2022-03-29 16:26:53
 * @LastEditors: xieshengyong
 */
let Client = require('ssh2-sftp-client');
let sftp = new Client();

sftp.connect({
    host: '',
    port: '22',
    username: '',
    password: ''
}).then(() => {
    // return sftp.list('/developmemt/');
    // xxx.treedom.cn需修改为已创建好的服务器目录。
    return sftp.put('dist/index.html', '/developmemt/xxx.treedom.cn/index.html');
}).then(data => {
    console.log('sftp上传成功：', data);
}).catch(err => {
    console.log(err, 'catch error');
}).finally(() => {
    sftp.end();
});
