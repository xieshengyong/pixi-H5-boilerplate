/**
 * Created by z on 2017/6/5.
 */
const path = require('path');
// const webpack = require('webpack');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SpritesmithPlugin = require('webpack-spritesmith');

var copyItem = [];

if (fs.existsSync('src/img/copy')) {
    copyItem.push({
        from: 'src/img/copy',
        to: './',
        flatten: true
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
                {
                    test: /\.ejs/,
                    // include: [
                    //     path.resolve(__dirname, 'src/app')
                    // ],
                    exclude: [
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, 'index.ejs')
                    ],
                    use: [
                        {
                            loader: 'ejs-compiled-loader',
                            options: {}
                        }
                        // {
                        //     loader: 'ejs-loader',
                        //     options: {}
                        // }
                    ]
                },
                // todo: lib下的js未进行压缩
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
                                name: 'js/lib/[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(fnt|png|jpg|gif|svg|ttf|TTF|OTF|atlas)$/,
                    include: [
                        path.resolve(__dirname, 'src/img')
                    ],
                    exclude: [
                        path.resolve(__dirname, 'src/img/spriteSheet'),
                        path.resolve(__dirname, 'src/img/delayLoadSpriteSheet'),
                        path.resolve(__dirname, 'src/img/dragonBonesAssets')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: 'img/[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(plist|int|json|png|jpg|atlas)$/,
                    include: [
                        path.resolve(__dirname, 'src/img/dragonBonesAssets')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: 'img/dragonBonesAssets/[name].[ext]'
                            }
                        }
                    ],
                    type: 'javascript/auto'
                },
                {
                    test: /\.(plist|int|fnt|json|png|jpg|atlas)$/,
                    include: [
                        path.resolve(__dirname, 'src/img/spriteSheet')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: 'img/spriteSheet/[name].[ext]'
                            }
                        }
                    ],
                    type: 'javascript/auto'
                },
                {
                    test: /\.(plist|int|fnt|json|png|jpg)$/,
                    include: [
                        path.resolve(__dirname, 'src/img/delayLoadSpriteSheet')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: 'img/delayLoadSpriteSheet/[name].[ext]'
                            }
                        }
                    ],
                    type: 'javascript/auto'
                },
                {
                    test: /\.(mp3|mp4|ss)$/,
                    include: [
                        path.resolve(__dirname, 'src/media')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: 'img/[name].[ext]'
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
                                name: 'img/[name].[ext]'
                            }
                        }
                    ]
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
            new HtmlWebpackPlugin({
                filename: './index.html',
                template: 'index.ejs',
                // template: 'ejs-render-loader!index.ejs',
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
        ],
        externals: {
            '$': 'window.$',
            'global': 'window.global'
        }
    };
};
