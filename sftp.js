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
    // return sftp.list('/var/ftp/pub');
    return sftp.put('dist/index.html', '/var/ftp/pub/mini6th/index.html');
}).then(data => {
    console.log('sftp上传成功：', data);
}).catch(err => {
    console.log(err, 'catch error');
}).finally(() => {
    sftp.end();
});
