import '../less/style.less';

import View from './app/tool/View';
// 引入的包根据实际情况而定
import LoadViewController from './app/LoadViewController';
import IndexViewController from './app/IndexViewController';

(function () {
    const ViewInstance = new View();

    // load页面
    const loadPageBack = () => {
        let loadView = new LoadViewController(ViewInstance);

        loadView.on('showIndex', indexPageBack);

        window.addEventListener('load', loadView.show.bind(loadView));
    };

    // 长图页面
    const indexPageBack = (debug: boolean) => {
        let indexView = new IndexViewController(ViewInstance);

        indexView.show(debug);
    };

    loadPageBack();
})();
