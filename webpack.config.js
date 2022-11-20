const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");

const devConfig = {
    entry: "./src/index.js",

    output: {
        filename: "script.min.js",
        assetModuleFilename: "img/[contenthash][ext][query]",
        publicPath: "/src/",
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: "body",
        }),

        new SpriteLoaderPlugin(),
    ],

    devServer: {
        port: 8000,
        inline: false,
        hot: true,
    },

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.js|\.jsx$/i,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },

            {
                test: /\.(jpe?g|png|gif|webp|svg)$/i,
                exclude: path.resolve(__dirname, "src/img/sprite"),
                type: "asset/resource",
            },

            {
                test: /\.svg$/i,
                loader: "svg-sprite-loader",
                include: path.resolve(__dirname, "src/img/sprite"),
                options: {
                    extract: true,
                    publicPath: "img/"
                }
            },

            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ["autoprefixer"],
                                ],
                            },
                        },
                    },
                    "sass-loader"
                ],
            }
        ],
    },

    optimization: {
        minimizer: [
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            "imagemin-gifsicle",
                            "imagemin-mozjpeg",
                            "imagemin-pngquant",
                            "imagemin-svgo",
                        ],
                    },
                },
            }),
        ],
    },
};

const prodConfig = {
    entry: "./src/index.js",

    output: {
        filename: "[contenthash].bundle.js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: "img/[contenthash][ext][query]",
        clean: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html"),
            minify: true,
            filename: "index.html",
            inject: "body",
            cache: false,
        }),

        new MiniCssExtractPlugin({
            filename: "[contenthash].min.css",
        }),

        new CopyPlugin({
            patterns: [
                {from: "./src/favicon", to: "./favicon"},
                {from: "./src/libs", to: "./libs"},
            ],
        }),

        new SpriteLoaderPlugin(),

        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },

            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    sources: {
                        list: [
                            {
                                tag: "img",
                                attribute: "src",
                                type: "src",
                            },
                            {
                                tag: "img",
                                attribute: "srcset",
                                type: "srcset",
                            },
                            {
                                tag: "source",
                                attribute: "srcset",
                                type: "src",
                            },
                        ],
                    },
                },
            },

            {
                test: /\.(jpe?g|png|gif|webp|svg)$/i,
                exclude: path.resolve(__dirname, "src/img/sprite"),
                type: "asset/resource",
            },

            {
                test: /\.svg$/i,
                loader: "svg-sprite-loader",
                include: path.resolve(__dirname, "src/img/sprite"),
                options: {
                    extract: true,
                    publicPath: "img/",
                }
            },

            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ["autoprefixer"],
                                ],
                            },
                        },
                    },
                    "sass-loader"
                ],
            }
        ],
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false
            }),

            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.squooshMinify,
                    options: {
                        encodeOptions: {
                            mozjpeg: {
                                quality: 75,
                            },
                            webp: {
                                lossless: 0,
                            },
                            png: {
                                quality: 75,
                            }
                        },
                    },
                },
            }),
        ],
    },
};

const mode = {
    development: devConfig,
    production: prodConfig
};

module.exports = (env, argv) => {
    return mode[argv.mode];
};
