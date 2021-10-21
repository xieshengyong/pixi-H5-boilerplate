/*
 * @Author: xieshengyong
 * @Date: 2017-06-5 22:23:56
 * @LastEditTime: 2021-10-21 21:49:59
 * @LastEditors: xieshengyong
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./package.json');

const DefinePlugin = webpack.DefinePlugin;

const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.base.js');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function (env) {
    return merge (commonConfig(), {
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
            path: path.resolve(__dirname, './dist'),
            // filename: '[name].[hash:4].js',
            filename: (pathData) => {
                return pathData.chunk.name === 'vendor' ? '[name].js' : '[name].[hash:4].js';
            },
            publicPath: config.projectConfigs.path.dev
        },
        devtool: 'inline-source-map',
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
                'process.env.NODE_ENV': JSON.stringify('development'),
                'process.env.PATH': JSON.stringify(config.projectConfigs.path.dev),
            })
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, './')
            },
            // host: '0.0.0.0',
            hot: true,
            compress: true,
        }
    });
};
