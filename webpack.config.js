var webpack = require("webpack");
var nodeExternals = require('webpack-node-externals');
var fs = require("fs");
var path = require("path");
var packageJson = require("./package.json");

module.exports = {
    target: "node",
    mode: "production",
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "api.js",
        library: "@wartoshika/qhun-transpiler",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                use: "raw-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        descriptionFiles: ["package.json"],
        extensions: [".tsx", ".ts"]
    },
    plugins: [
        new webpack.DefinePlugin({
            PJSON_NAME: JSON.stringify(packageJson.name),
            PJSON_VERSION: JSON.stringify(packageJson.version),
            PJSON_AUTHOR: JSON.stringify(packageJson.author),
            PJSON_DESCRIPTION: JSON.stringify(packageJson.description),
            PJSON_LICENSE: JSON.stringify(packageJson.license),
            PJSON_URL: JSON.stringify(packageJson.repository.url),
            PJSON_BUG_URL: JSON.stringify(packageJson.bugs.url)
        })
    ],
    externals: [nodeExternals()]
}