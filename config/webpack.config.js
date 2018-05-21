const path = require("path");
const webpack = require("webpack");
const sharedPlugins = require("./sharedPlugins");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const plugins = [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new webpack.HotModuleReplacementPlugin(),
];

function resolve(dir) {
    return path.join(__dirname, dir);
}

/**
 * Using ts-loader for JS-transpiling instead of babel
 */
module.exports = {
    devtool: "inline-source-map",
    mode: "development",
    entry: {
        vendor: ["PIXIJS", "PIXIProjection"],
        game: ["webpack-hot-middleware/client?reload=true",
            resolve("/../app/src/main.js")],
    },
    output: {
        path: resolve("/../dist/"),
        filename: "[name].bundle.js",
        publicPath: "/",
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all",
                },
            },
        },
    },
    node: {
        fs: "empty",
    },
    resolve: {
        modules: [
            resolve("/../dist/"),
            "node_modules",
        ],
        alias: {
            // external libraries
            PIXIJS: resolve("./../node_modules/pixi.js/dist/pixi"),
            PIXIProjection: resolve("./../node_modules/pixi-projection/dist/pixi-projection"),
        },
    },

    plugins: plugins.concat(sharedPlugins),
    module: {
        rules: [
            {
                test: /^(?!.*\.{test,min}\.js$).*\.js$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
        ],
    },
};
