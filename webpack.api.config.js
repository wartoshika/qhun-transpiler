var path = require('path');
var base = require("./webpack.config.js");
var merge = require("webpack-merge");

module.exports = merge(base, {
    entry: './src/index.ts',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'api.js',
        library: "@wartoshika/qhun-transpiler",
        libraryTarget: "umd",
        umdNamedDefine: true
    }
});