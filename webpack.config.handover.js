/**
 * Created by z on 2017/6/5.
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./config.path');
const fs = require('fs');

const WebpackStrip = require('webpack-strip');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const cssTemplate = require('./sprite/cssTemplate');
//
// const spriteImg = require('./sprite/spriteImg');

const DefinePlugin = webpack.DefinePlugin;

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const SpritesmithPlugin = require('webpack-spritesmith');

let isQn = process.env.NODE_ENV2 === 'qn';
let PubPath = process.env.TEST ? config.handoverTest : config.handover;
isQn && (PubPath = config.qn);
const handoverDir = isQn ? '' : /a20[\w]*/.exec(PubPath)[0];

isQn = true;

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
        mode: 'production',
        entry: {
            vendor: './src/js/vendor.ts',
            main: './src/js/index.ts'
        },
        output: {
            path: path.resolve(__dirname, './dist/' + handoverDir + '/ossweb-img'),
            filename: (pathData) => {
                // return pathData.chunk.name === 'vendor' ? '[name].js' : isQn ? '[name].[hash:8].js' : '[name].js';
                return '[name].[hash:8].js';
            },
            publicPath: PubPath
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
                                minimize: true
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
                                ieCompat: false
                            }
                        }
                    ]
                },
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
                },
                {
                    test: /\.(png|jpg|gif|svg|ttf|TTF|OTF)$/,
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
                                name: isQn ? '[name].[hash:8].[ext]' : '[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(plist|int|json|png|jpg)$/,
                    include: [
                        path.resolve(__dirname, 'src/img/dragonBonesAssets')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: 'dragonBonesAssets/[name].[ext]'
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
                                name: 'spriteSheet/[name].[ext]'
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
                                name: 'delayLoadSpriteSheet/[name].[ext]'
                            }
                        }
                    ],
                    type: 'javascript/auto'
                },
                {
                    test: /\.(mp4|mp3|ss)$/,
                    include: [
                        path.resolve(__dirname, 'src/media')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 5120,
                                name: isQn ? '[name].[hash:8].[ext]' : '[name].[ext]'
                            }
                        }
                    ]
                },
                // {
                //     test: /\.(mp3|ss)$/,
                //     include: [
                //         path.resolve(__dirname, 'src/media/talkSound.mp3')
                //     ],
                //     use: [
                //         {
                //             loader: 'url-loader',
                //             options: {
                //                 limit: 1,
                //                 name: '../[name].[ext]'
                //             }
                //         }
                //     ]
                // },
                // {
                //     test: /\.(mp4)$/,
                //     include: [
                //         path.resolve(__dirname, 'src/media')
                //     ],
                //     use: [
                //         {
                //             loader: 'url-loader',
                //             options: {
                //                 limit: 1,
                //                 name: '../[name].[ext]'
                //             }
                //         }
                //     ]
                // },
                {
                    test: /\.(ttf|woff|OTF)$/,
                    include: [
                        path.resolve(__dirname, 'src/font')
                    ],
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1,
                                name: isQn ? '[name].[hash:8].[ext]' : '[name].[ext]'
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
            new CleanPlugin('dist'),
            new MiniCssExtractPlugin({
                filename: isQn ? '[name].[contenthash:8].css' : '[name].css'
            }),
            // new ExtractTextPlugin('[name].css'),
            new CopyWebpackPlugin(copyItem),
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('handover'),
                    'NODE_ENV2': JSON.stringify(process.env.NODE_ENV2),
                    'PATH': JSON.stringify(PubPath)
                }
            }),
            new HtmlWebpackPlugin({
                filename: isQn ? '../index.html' : '../index_wq.html',
                template: 'index.ejs',
                inject: false,
                chunks: ['vendor', 'main'],
                hash: false,
                minify: {
                    removeComments: false, // 移除HTML中的注释
                    collapseWhitespace: false, // 删除空白符与换行符
                    minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                    minifyJS: false // 压缩 HTML 中出现的 JS 代码
                }
            })
            // new DefinePlugin({
            //     'process.env': {
            //         'NODE_ENV': JSON.stringify('handover'),
            //         'NODE_ENV_TEST': 'true',
            //         'PATH': JSON.stringify(config.handover)
            //     }
            // }),
            // new HtmlWebpackPlugin({
            //     filename: '../test.html',
            //     template: 'index.ejs',
            //     inject: false,
            //     hash: false,
            //     minify: {
            //         removeComments: false, // 移除HTML中的注释
            //         collapseWhitespace: false, // 删除空白符与换行符
            //         minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
            //         minifyJS: true // 压缩 HTML 中出现的 JS 代码
            //     }
            // })
            // new UglifyJSPlugin({
            //     uglifyOptions: {
            //         compress: {
            //             drop_console: !false
            //         }
            //     }
            // }),
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
        ],
        externals: {
            '$': 'window.$',
            'global': 'window.global'
        }
    };
};
