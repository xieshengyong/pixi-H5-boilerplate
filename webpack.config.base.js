/*
 * @Author: xieshengyong
 * @Date: 2017-06-5 22:23:56
 * @LastEditTime: 2021-10-21 21:49:55
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
                //             loader: 'ejs-compiled-loader',
                //             options: {}
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
                        filename: '[name][hash:8][ext]'
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
                    test: /\.(mp3|mp4|ss)$/,
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
                        filename: '[name][hash:8][ext]'
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
                        filename: '[name][hash:8][ext]'
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
            // new SpritesmithPlugin({
            //     // 目标小图标
            //     src: {
            //         cwd: path.resolve(__dirname, `./src/sprite/sprite`),
            //         glob: '*.png'
            //     },
            //     // 输出雪碧图文件及样式文件
            //     target: {
            //         image: path.resolve(__dirname, `./src/img/bg_sprite.png`),
            //         css: [
            //             [path.resolve(__dirname, `./src/less/sprite.less`), {
            //                 format: 'sprite_function_template',
            //                 spritesheetName: 'sprite'
            //             }]
            //         ]
            //     },
            //     customTemplates: {
            //         'sprite_function_template': data => {
            //             let sprites = data.sprites.map(sprite => {
            //                 return `.sprite.${sprite.name} {
            //             width: ${sprite.width}px;
            //             height: ${sprite.height}px;
            //             background-size: ${data.spritesheet.width}px ${data.spritesheet.height}px;
            //             background-repeat: no-repeat;
            //             background-position: ${sprite.offset_x}px ${sprite.offset_y}px;
            //         }`;
            //             }).join('\n');
            //             return `.sprite{background-image: url(${data.spritesheet.image});}\n${sprites}`;
            //         }
            //     },
            //     // 样式文件中调用雪碧图地址写法
            //     apiOptions: {
            //         cssImageRef: `../img/bg_sprite.png`
            //     },
            //     spritesmithOptions: {
            //         algorithm: 'binary-tree',
            //         padding: 4
            //     }
            // })
            // new SpritesmithPlugin({
            //     // 目标小图标
            //     src: {
            //         cwd: path.resolve(__dirname, `./src/sprite/sprite-box`),
            //         glob: '*.png'
            //     },
            //     // 输出雪碧图文件及样式文件
            //     target: {
            //         image: path.resolve(__dirname, `./src/img/bg_sprite_box.png`),
            //         css: [
            //             [path.resolve(__dirname, `./src/less/sprite-box.less`), {
            //                 format: 'sprite_function_template_box',
            //                 spritesheetName: 'sprite'
            //             }]
            //         ]
            //     },
            //     customTemplates: {
            //         'sprite_function_template_box': data => {
            //             let sprites = data.sprites.map(sprite => {
            //                 return `.sprite-box.${sprite.name} {
            //             width: ${sprite.width}px;
            //             height: ${sprite.height}px;
            //             background-size: ${data.spritesheet.width}px ${data.spritesheet.height}px;
            //             background-repeat: no-repeat;
            //             background-position: ${sprite.offset_x}px ${sprite.offset_y}px;
            //         }`;
            //             }).join('\n');
            //             return `.sprite-box{background-image: url(${data.spritesheet.image});}\n${sprites}`;
            //         }
            //     },
            //     // 样式文件中调用雪碧图地址写法
            //     apiOptions: {
            //         cssImageRef: `../img/bg_sprite_box.png`
            //     },
            //     spritesmithOptions: {
            //         algorithm: 'binary-tree',
            //         padding: 4
            //     }
            // })
        ]
        // externals: {
        //     '$': 'window.$',
        //     'global': 'window.global'
        // }
    };
};
