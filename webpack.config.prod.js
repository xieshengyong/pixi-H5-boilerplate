/* eslint-disable camelcase */
/*
 * @Author: xieshengyong
 * @Date: 2018-06-5 22:23:56
 * @LastEditTime: 2022-02-24 23:36:36
 * @LastEditors: xieshengyong
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./package.json');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.base.js');

const DefinePlugin = webpack.DefinePlugin;

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const PubPath = config.projectConfigs.path[process.env.NODE_ENV];
// const zipName = config.projectConfigs.zipName;

module.exports = function () {
    return webpackMerge(commonConfig(), {
        mode: 'production',
        output: {
            path: path.resolve(__dirname, './dist/ossweb-img'),
            filename: (pathData) => {
                return '[name].[hash:8].js';
            },
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
            new CleanPlugin('dist'),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css'
            }),
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'PATH': JSON.stringify(PubPath)
                }
            }),
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        drop_console: false
                    }
                }
            })
        ]
    });
};
