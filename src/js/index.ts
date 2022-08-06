/* eslint-disable no-unused-vars */
import '../less/style.less';

/* 引入的包根据实际情况而定 */
import LoadViewController from './app/LoadViewController';
import IndexViewController from './app/IndexViewController';

/* 测试项目--可删除--start */
import * as dat from 'dat.gui';
window.addEventListener('load', () => {
    const gui = new dat.GUI();
    // @ts-ignore
    let caseList = require.context('./app/testCase/', false, /(\.js|\.ts)/);
    let currentCase: any = null;
    caseList.keys().forEach(async (element: any) => {
        let caseName = element.match(/\/(.*)\./)[1];
        let button: any = {};
        button[caseName] = function () {
            import('./app/testCase/' + caseName).then(module => {
                currentCase?.hide();
                currentCase = new module[caseName]();
            });
        };

        gui.add(button, caseName);

        // 直接执行
        // button['ColorDetection']?.();
    });
});
/* 测试项目--可删除--end */

(function () {
    // load页面
    const loadPageBack = () => {
        let loadView = new LoadViewController();

        loadView.on('showIndex', indexPageBack);

        window.addEventListener('load', loadView.show.bind(loadView));
    };

    // 长图页面
    const indexPageBack = () => {
        let indexView = new IndexViewController();

        indexView.show();
    };

    // loadPageBack();
})();
