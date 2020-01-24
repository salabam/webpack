const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = baseWebpackConfig.externals.paths;
const TEMPLATES = baseWebpackConfig.externals.templates;
const TEMPLATES_DIR = baseWebpackConfig.externals.templates_dir;

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: PATHS.dist,
        port: 8081,
        overlay: {
            warnings: false,
            errors: true
        }
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        }),
        ...TEMPLATES.map(p => new HtmlWebpackPlugin({
            template: `${TEMPLATES_DIR}/${p}`,
            filename: `./${p.replace(/\.pug/, '.html')}`,
        }))
    ]
});

module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig);
});