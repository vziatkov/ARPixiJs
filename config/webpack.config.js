const path = require("path");
const webpack = require("webpack");
const sharedPlugins = require("./sharedPlugins");

const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
    }),
];

/**
 * Using ts-loader for JS-transpiling instead of babel
 */
module.exports = {
    devtool: "inline-source-map",
    entry: [
        "webpack-hot-middleware/client?reload=true",
        path.join(__dirname, "/../app/src/main.js"),
    ],
    output: {
        path: path.join(__dirname, "/../dist/"),
        filename: "[name].bundle.js",
        publicPath: "/",
    },
    resolve: {
        extensions: [".js"],
    },
    plugins: plugins.concat(sharedPlugins),
    module: {
        rules: [{
            test: /\.js$/,
            use: "ts-loader",
            exclude: /node_modules/,
        }],
    },
};
