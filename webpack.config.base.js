/*
 * @Author: xieshengyong
 * @Date: 2017-06-5 22:23:56
 * @LastEditTime: 2022-01-20 15:46:23
 * @LastEditors: xieshengyong
 */
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const SpritesmithPlugin = require('webpack-spritesmith');
const DefinePlugin = webpack.DefinePlugin;

let sheetPath = Math.random().toString(36).slice(-5) + '/';

var copyItem = { patterns: [] };
if (fs.existsSync('src/img/copy')) {
    copyItem.patterns.push({
        from: 'src/img/copy',
        to: './'
    });
}

module.exports = function () {
    return {
        entry: {
            vendor: './src/js/vendor.ts',
            main: './src/js/index.ts'
        },
        module: {
            rules: [
                // {
                //     test: /\.ejs/,
                //     exclude: [
                //         path.resolve(__dirname, 'node_modules')
                //     ],
                //     use: [
                //         {
                //             loader: 'ejs-loader',
                //             options: {
                //                 esModule: false,
                //                 variable: 'data',
                //             }
                //         }
                //     ]
                // },
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname, 'src/js/lib')
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
                {
                    test: /\.(fnt|png|jpg|gif|svg|json|int|plist|atlas|ttf|frag)$/,
                    include: [
                        path.resolve(__dirname, 'src/img')
                    ],
                    exclude: [
                        path.resolve(__dirname, 'src/img/spriteSheet'),
                        path.resolve(__dirname, 'src/img/delayLoadSpriteSheet'),
                        path.resolve(__dirname, 'src/img/dragonBonesAssets')
                    ],
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 0.1 * 1024
                        }
                    },
                    generator: {
                        filename: '[name].[hash:8][ext]'
                    }
                },
                {
                    test: /\.(fnt|png|jpg|gif|svg|json|int|plist|atlas|ttf|frag)$/,
                    include: [
                        path.resolve(__dirname, 'src/img/spriteSheet'),
                        path.resolve(__dirname, 'src/img/delayLoadSpriteSheet'),
                        path.resolve(__dirname, 'src/img/dragonBonesAssets')
                    ],
                    type: 'asset/resource',
                    // parser: {
                    //     dataUrlCondition: {
                    //         maxSize: 0.1 * 1024
                    //     }
                    // },
                    generator: {
                        filename: sheetPath + '[name][ext]'
                        // filename: '[name][ext]'
                    }
                },
                {
                    test: /\.(mp3|mp4|ttf)$/,
                    include: [
                        path.resolve(__dirname, 'src/media')
                    ],
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 0.1 * 1024
                        }
                    },
                    generator: {
                        filename: '[name].[hash:8][ext]'
                    }
                },
                {
                    test: /\.(ttf|woff|TTF|OTF)$/,
                    include: [
                        path.resolve(__dirname, 'src/font')
                    ],
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 0.1 * 1024
                        }
                    },
                    generator: {
                        filename: '[name].[hash:8][ext]'
                    }
                }
            ]
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            },
            extensions: ['.ts', '.js']
        },
        plugins: [
            new CopyWebpackPlugin(copyItem),
            new DefinePlugin({
                'process.env.sheetPath': JSON.stringify(sheetPath)
            }),
            new HtmlWebpackPlugin({
                filename: process.env.NODE_ENV ? '../index.html' : './index.html',
                template: 'index.ejs',
                inject: false,
                chunks: ['vendor', 'main'],
                hash: false,
                minify: {
                    removeComments: true, // 移除HTML中的注释
                    collapseWhitespace: false, // 删除空白符与换行符
                    minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                    minifyJS: true // 压缩 HTML 中出现的 JS 代码
                }
            })
        ]
    };
};
