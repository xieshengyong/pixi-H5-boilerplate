/* eslint-disable no-unused-vars */
import '../less/style.less';

/* 引入的包根据实际情况而定 */
import LoadViewController from './app/LoadViewController';
import IndexViewController from './app/IndexViewController';
import { PixiJsSpineTest } from './app/testCase/PixiJsSpineTest';

/* 测试项目--可删除--start */
// import * as dat from 'dat.gui';
// window.addEventListener('load', () => {
//     const gui = new dat.GUI();

//     // @ts-ignore
//     let aa = require.context('./app/testCase/', false, /(\.js|\.ts)/);
//     aa.keys().forEach(async (element: any) => {
//         let name = element.match(/\/(.*)\./)[1];
//         let button: any = {};
//         button[name] = function () {
//             import('./app/testCase/' + name).then(module => {
//                 return new module[name]();
//             });
//         };

//         gui.add(button, name);
//     });
// });
/* 测试项目--可删除--end */
new PixiJsSpineTest();

(function () {
    // load页面
    const loadPageBack = () => {
        // let loadView = new LoadViewController();

        // loadView.on('showIndex', indexPageBack);

        // window.addEventListener('load', loadView.show.bind(loadView));
    };

    // 长图页面
    const indexPageBack = () => {
        let indexView = new IndexViewController();

        indexView.show();
    };

    loadPageBack();
})();
