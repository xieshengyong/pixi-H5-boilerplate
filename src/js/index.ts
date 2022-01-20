import '../less/style.less';

/* 引入的包根据实际情况而定 */
import LoadViewController from './app/LoadViewController';
import IndexViewController from './app/IndexViewController';
import VideoMpegTest from './app/testCase/VideoMpegTest';

(function () {
    // load页面
    const loadPageBack = () => {
        let loadView = new LoadViewController();
        new VideoMpegTest();

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
