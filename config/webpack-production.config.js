const path = require("path");
const devConfig = require("./webpack.config.js");
const webpack = require("webpack");
const sharedPlugins = require("./sharedPlugins");

const plugins = [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
    }),
];

const config = Object.assign({}, devConfig, {
    devtool: "",
    mode: "production",
    entry: [
        path.join(__dirname, "/../app/src/main.js"),
    ],
    plugins: plugins.concat(sharedPlugins),
});

module.exports = config;
