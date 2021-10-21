/*
 * @Author: xieshengyong
 * @Date: 2017-06-5 22:23:56
 * @LastEditTime: 2021-10-21 21:50:03
 * @LastEditors: xieshengyong
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./package.json');
// const fs = require('fs');

// const WebpackStrip = require('webpack-strip');

// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.base.js');

// const cssTemplate = require('./sprite/cssTemplate');
//
// const spriteImg = require('./sprite/spriteImg');

const DefinePlugin = webpack.DefinePlugin;

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// const SpritesmithPlugin = require('webpack-spritesmith');

let PubPath = config.projectConfigs.path[process.env.NODE_ENV];
// const zipName = config.projectConfigs.zipName;

// var copyItem = [];
// if (fs.existsSync('src/img/copy')) {
//     copyItem.push({
//         from: 'src/img/copy',
//         to: './',
//         flatten: true
//     });
// }

module.exports = function () {
    return merge(commonConfig(), {
        mode: 'production',
        // entry: {
        //     vendor: './src/js/vendor.ts',
        //     main: './src/js/index.ts'
        // },
        devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, './dist/ossweb-img'),
            filename: '[name].[hash:8].js',
            // filename: (pathData) => {
            //     // return pathData.chunk.name === 'vendor' && '[name].js';
            //     return '[name].[hash:8].js';
            // },
            publicPath: PubPath
        },
        module: {
            rules: [
                {
                    test: /\.less$/,
                    include: [
                        path.resolve(__dirname, 'src/less')
                    ],
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                // importLoaders: 2,
                                // minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                // ieCompat: false
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|ts)$/,
                    include: [
                        path.resolve(__dirname, 'src/js')
                    ],
                    exclude: [
                        path.resolve(__dirname, 'src/js/lib')
                    ],
                    use: [
                        {
                            loader: 'ts-loader'
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin (),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css'
            }),
            // new CopyWebpackPlugin(copyItem),
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'PATH': JSON.stringify(PubPath)
                }
            }),
            // new UglifyJSPlugin({
            //     uglifyOptions: {
            //         compress: {
            //             drop_console: !false
            //         }
            //     }
            // })
            // new SpritesmithPlugin({
            //         // 目标小图标
            //         src: {
            //             cwd: path.resolve(__dirname, `./src/sprite/sprite`),
            //             glob: '*.png'
            //         },
            //         // 输出雪碧图文件及样式文件
            //         target: {
            //             image: path.resolve(__dirname, `./src/img/bg_sprite.png`),
            //             css: [
            //                 [path.resolve(__dirname, `./src/less/sprite.less`), {
            //                     format: 'sprite_function_template',
            //                     spritesheetName: 'sprite'
            //                 }]
            //             ]
            //         },
            //         customTemplates: {
            //             'sprite_function_template': data => {
            //                 let sprites = data.sprites.map(sprite => {
            //                     return `.sprite.${sprite.name} {
            //             width: ${sprite.width}px;
            //             height: ${sprite.height}px;
            //             background-size: ${data.spritesheet.width}px ${data.spritesheet.height}px;
            //             background-repeat: no-repeat;
            //             background-position: ${sprite.offset_x}px ${sprite.offset_y}px;
            //         }`;
            //                 }).join('\n');
            //                 return `.sprite{background-image: url(${data.spritesheet.image});}\n${sprites}`;
            //             }
            //         },
            //         // 样式文件中调用雪碧图地址写法
            //         apiOptions: {
            //             cssImageRef: `../img/bg_sprite.png`
            //         },
            //         spritesmithOptions: {
            //             algorithm: 'binary-tree',
            //             padding: 4
            //         }
            //     }),
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
            //         width: ${sprite.width}px;
            //         height: ${sprite.height}px;
            //         background-size: ${data.spritesheet.width}px ${data.spritesheet.height}px;
            //         background-repeat: no-repeat;
            //         background-position: ${sprite.offset_x}px ${sprite.offset_y}px;
            //     }`;
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
    });
};
