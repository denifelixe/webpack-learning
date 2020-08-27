var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
let PurgecssPlugin = require('purgecss-webpack-plugin');
// const PATHS = {
//     src: path.join(__dirname, 'src')
// }
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    entry: { //https://webpack.js.org/configuration/entry-context/#entry
        name_you_like: './src/main.js'
    },
    mode: 'development', // https://v4.webpack.js.org/configuration/mode/
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js', // https://webpack.js.org/configuration/entry-context/#output-filename
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            filename: '[name].[chunkhash].css',
        }),

        new PurgecssPlugin({
            // paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
            paths: glob.sync(path.join(__dirname, 'index.html'),  { nodir: true })
        }),

        new CleanWebpackPlugin(),

        new ManifestPlugin()
    ],
    module: {
        rules: [

            {
                test: /\.css$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader', 
                    // Translates CSS into CommonJS
                    'css-loader'
                ],
            },

            {
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader" 
            },

            // Not Extract CSS into Dedicated Files
            // {
            //     test: /\.s[ac]ss$/i,
            //     use: [
            //         // Creates `style` nodes from JS strings
            //         'style-loader',
            //         // Translates CSS into CommonJS
            //         'css-loader',
            //         // Compiles Sass to CSS
            //         'sass-loader',
            //     ],
            // },

            // Extract CSS into Dedicated Files
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Extract CSS into Dedicated Files
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    // {
                    //     loader: 'css-loader',
                    //     options: {
                    //         url: false
                    //     }
                    // },
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ]
            },

            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // name: '[path][name].[ext]', 
                            name: 'images/[name].[contenthash].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    floyd: 0.5,
                                    speed: 2
                                }),
                                require('imagemin-svgo')({
                                    plugins: [
                                        { removeTitle: true },
                                        { convertPathData: false }
                                    ]
                                })
                            ]
                        }
                    }
                ]
            }

        ],
    },
};