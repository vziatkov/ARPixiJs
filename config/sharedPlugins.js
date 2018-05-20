const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const plugins = [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, "/../app/index.html"),
        inject: "body",
        filename: "index.html",
    }),
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
    })
];
module.exports = plugins;
