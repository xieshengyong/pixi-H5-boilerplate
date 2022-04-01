/*
 * @Author: xieshengyong
 * @Date: 2018-06-5 22:23:56
 * @LastEditTime: 2022-03-31 19:28:44
 * @LastEditors: xieshengyong
 */
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DefinePlugin = webpack.DefinePlugin;

let randomStr = Math.random().toString(36).slice(-5);
let sheetPath = randomStr + '/';

var copyItem = [];

if (fs.existsSync('src/img/copy')) {
    copyItem.push({
        from: 'src/img/copy',
        to: './',
        flatten: true
    });
}
if (fs.existsSync('ccc')) {
    copyItem.push({
        from: 'ccc',
        to: './',
        flatten: !true
    });
}

module.exports = function () {
    return {
        entry: {
            // vendor: './src/js/vendor.ts',
            main: './src/js/index.ts'
        },
        stats: 'errors-only',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname, 'src/js/lib'),
                        path.resolve(__dirname, 'src/act')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: '[name].[ext]'
                            }
                        }
                    ]
                },
                // {
                //     test: /\.(fnt|png|jpg|gif|svg|json|int|plist|atlas|js|frag)$/,
                //     include: [
                //         path.resolve(__dirname, 'ccc')
                //     ],
                //     use: [
                //         {
                //             loader: 'url-loader',
                //             options: {
                //                 limit: 1,
                //                 name: '[name].[ext]'
                //             }
                //         }
                //     ],
                //     type: 'javascript/auto'
                // },
                {
                    test: /\.(fnt|png|jpg|gif|svg|json|int|plist|atlas|ttf|frag)$/,
                    include: [
                        path.resolve(__dirname, 'src/img')
                    ],
                    exclude: [
                        path.resolve(__dirname, 'src/img/spriteSheet'),
                        path.resolve(__dirname, 'src/img/delayLoadSpriteSheet')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: '[name].[hash:8].[ext]'
                            }
                        }
                    ],
                    type: 'javascript/auto'
                },
                {
                    test: /\.(fnt|png|jpg|gif|svg|json|int|plist|atlas|ttf|frag)$/,
                    include: [
                        path.resolve(__dirname, 'src/img/spriteSheet'),
                        path.resolve(__dirname, 'src/img/delayLoadSpriteSheet')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: sheetPath + '[name].[ext]'
                            }
                        }
                    ],
                    type: 'javascript/auto'
                },
                {
                    test: /\.(mp3|mp4|ss|ttf|ts)$/,
                    include: [
                        path.resolve(__dirname, 'src/media')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: '[name].[hash:8].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|woff|TTF|OTF)$/,
                    include: [
                        path.resolve(__dirname, 'src/font')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: '[name].[hash:8].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            // alias: {
            //     '@': path.resolve(__dirname, 'src')
            // },
            extensions: ['.ts', '.js']
        },
        plugins: [
            new CopyWebpackPlugin(copyItem),
            new DefinePlugin({
                'process.env': {
                    'sheetPath': JSON.stringify(sheetPath)
                }
            }),
            new HtmlWebpackPlugin({
                filename: process.env.NODE_ENV ? '../index.html' : './index.html',
                template: 'index.ejs',
                // template: 'ejs-render-loader!index.ejs',
                inject: false,
                // chunks: ['vendor', 'main'],
                hash: false,
                minify: {
                    removeComments: !true, // 移除HTML中的注释
                    collapseWhitespace: false, // 删除空白符与换行符
                    minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                    minifyJS: !true // 压缩 HTML 中出现的 JS 代码
                }
            })
        ],
        externals: {
            '$': 'window.$',
            'global': 'window.global',
            'PIXI': 'window.PIXI'
        }
    };
};
