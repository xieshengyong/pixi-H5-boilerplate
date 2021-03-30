const fs = require('fs');

const path = require('path');
function getAllDirs (mypath = './src/img') {

    const items = fs.readdirSync(mypath);

    let result = 'export default [';
    // 遍历当前目录中所有的文件和文件夹
    let strTemp = function (name) {
        name2 = name.replace(/\\/g, '/');
        name2 = name2.replace(/src/g, '');
        result += `{
            "name": "${name2}",
            "url": require('@${name2}')
        },
        `;
    };
    items.map(item => {
        let temp = path.join(mypath, item);

        // 若当前的为文件夹
        if (!fs.statSync(temp).isDirectory()) {
            strTemp(temp); // 存储当前文件夹的名字
        // 进入下一级文件夹访问
        // result = result.concat(getAllDirs(temp));
        }
    });

    // result.replace('')
    result += ']';

    return result;
};
fs.writeFile(path.join(path.resolve(__dirname), './src/json/output.js'), getAllDirs(), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log('File saved successfully!');
});
