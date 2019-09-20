var webpack = require("webpack");
var fs = require('fs');
var packageJson = require("./package.json");

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    target: 'node',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jso?n?$/i,
                use: 'raw-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        descriptionFiles: ["package.json"],
        extensions: ['.tsx', '.ts', '.js']
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
    externals: nodeModules
}