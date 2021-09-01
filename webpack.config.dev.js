/*
 * @Author: z
 * @Date: 2017-06-5 22:23:56
 * @LastEditTime: 2021-08-31 16:28:34
 * @LastEditors: xieshengyong
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./package.json');

const DefinePlugin = webpack.DefinePlugin;

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.base.js');

const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function (env) {
    return webpackMerge(commonConfig(), {
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].js',
            // filename: (pathData) => {
            //     return pathData.chunk.name === 'vendor' && '[name].js';
            // },
            publicPath: config.projectConfigs.path.dev
        },
        module: {
            rules: [
                {
                    test: /\.less$/,
                    include: [
                        path.resolve(__dirname, 'src/less')
                    ],
                    use: [
                        {
                            loader: 'style-loader',
                            options: {}
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                ieCompat: false
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
                            loader: 'ts-loader',
                            options: {
                                // disable type checker - we will use it in fork plugin
                                transpileOnly: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('dev'),
                    'PATH': JSON.stringify(config.projectConfigs.path.dev)
                }
            }),
            new HotModuleReplacementPlugin()
        ],
        devServer: {
            host: '0.0.0.0',
            contentBase: path.join(__dirname, './'),
            compress: true,
            inline: true,
            hot: true,
            disableHostCheck: true,
            // contentBase: path.join(__dirname, './'),
            // compress: true,
            // host: '10.0.128.183',
            // port: 3000,
            // https: true,
            // inline: true,
            // quiet: true,
            // hot: true,
            // hotOnly: true,
            watchOptions: {
                poll: true
            }
            // headers: {
            //     'Access-Control-Allow-Origin': '*'
            // },
            // before: (app, server) => {
            //     const watcher = sane(path.join(__dirname, './'), {
            //         glob: ['index.ejs'],
            //         poll: true
            //     });
            //     watcher.on('change', function (filePath, root, stat) {
            //         console.log('File modified:', filePath);
            //         server.sockWrite(server.sockets, 'content-changed');
            //     });
            // }
        }
    });
};
