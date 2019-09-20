var path = require('path');
var BannerPlugin = require('webpack/lib/BannerPlugin')
var base = require("./webpack.config.js");
var merge = require("webpack-merge");

module.exports = merge(base, {
    entry: './src/cli/Cli.ts',
    output: {
        path: path.join(__dirname, 'dist', 'bin'),
        filename: 'qhun-transpiler.js'
    },
    plugins: [
        new BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true
        })
    ]
});