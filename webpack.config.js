var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var BannerPlugin = require('webpack/lib/BannerPlugin')

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    mode: 'production',
    output: {
        path: path.join(__dirname, 'dist', 'bin'),
        filename: 'qhun-transpiler.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true
        })
    ],
    externals: nodeModules
}