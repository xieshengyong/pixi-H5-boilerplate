
module.exports = {
    entry: {
        main: './src/js/index.js'
    },
    output: {
        path: '.',
        filename: ''
    },
    module: {
        loaders: [
            {
                test: /js[\/|\\]lib[\/||\\][\w|\.|_|-]+js$/,
                loader: 'url-loader?importLoaders=1&limit=1000&name=/dist/js/[name].[ext]'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|dist|js[\/|\\]lib[\/||\\][\w|\.|_|-]+js$|fx|fx_methods|TweenLite.min|EasePack.min)/,
                loaders: ['babel-loader']
            }
        ]
    },
    resolve: {
        alias: {
            'zepto': './lib/zepto.min.js',
            'pixi': './lib/pixi.min.js'
        }
    },
    plugins: [],
    externals: {
        '$': 'window.$',
        'global': 'window.global',
        'TweenLite': 'window.TweenLite',
        'EasePack': 'window.EasePack'
    }
};
