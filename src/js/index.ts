import '../less/style.less';

// 引入的包根据实际情况而定
import LoadViewController from './app/LoadViewController';
import IndexViewController from './app/IndexViewController';

(function () {
    // load页面
    const loadPageBack = () => {
        let loadView = new LoadViewController();

        loadView.on('showIndex', indexPageBack);

        window.addEventListener('load', loadView.show.bind(loadView));
    };

    // 长图页面
    const indexPageBack = (debug: boolean) => {
        let indexView = new IndexViewController();

        indexView.show(debug);
    };

    loadPageBack();
})();
