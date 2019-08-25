require("@babel/polyfill");
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    entry: ['@babel/polyfill', './src/main.js'],

    output: {
        filename: 'js/[name].[chunkhash].js',
        path: path.resolve(__dirname, '../public')
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "styles/styles.[chunkhash].css"
        }),
        new VueLoaderPlugin()
    ],

    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                include: [path.resolve(__dirname, 'src')],
                loader: 'babel-loader',

                exclude: /node_modules/,

                options: {
                    plugins: ['syntax-dynamic-import'],

                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
                use: "file-loader?name=[path][name].[ext]?[hash]"
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.vue$/,
                use: "vue-loader"
            }
        ]
    },

    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        }
    },

    devtool: "source-map",

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },

            chunks: 'async',
            minChunks: 1,
            minSize: 30000,
            name: true
        }
    },

    devServer: {
        open: true
    }
};
