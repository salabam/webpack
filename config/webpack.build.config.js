const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackBeautifyPlugin = require('html-beautify-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const unformatted = [
    'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
    'code', 'data', 'datalist', 'del', 'dfn', 'em', 
    'embed', 'i', 'ins', 'kbd', 'keygen', 'map',
    'mark', 'math', 'meter', 'noscript', 'object', 
    'output', 'progress', 'q', 'ruby', 's', 'samp', 
    'small', 'strong', 'sub', 'sup', 'template', 
    'time', 'u', 'var', 'wbr', 'text', 'acronym', 
    'address', 'big', 'dt', 'ins', 'strike', 'tt'
];

const PATHS = baseWebpackConfig.externals.paths;
const TEMPLATES = baseWebpackConfig.externals.templates;
const TEMPLATES_DIR = baseWebpackConfig.externals.templates_dir;

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: `${TEMPLATES_DIR}/index.pug`,
            filename: `./${'index.pug'.replace(/\.pug/, '.html')}`,
            inject: false,
            links: [
                `/${PATHS.assets}css/main.css`,
            ],
            scripts: [
                `/${PATHS.assets}js/vendors.js`,
                `/${PATHS.assets}js/app.js`
            ]
        }),
        new HtmlWebpackPlugin({
            template: `${TEMPLATES_DIR}/test.pug`,
            filename: `./${'test.pug'.replace(/\.pug/, '.html')}`,
            inject: false,
            links: [
                `/${PATHS.assets}css/main.css`,
            ],
            scripts: [
                `/${PATHS.assets}js/vendors.js`,
                `/${PATHS.assets}js/app.js`,
                `/${PATHS.assets}js/about.js`
            ]
        }),
        ...TEMPLATES.map(p => new HtmlWebpackBeautifyPlugin({
            config: {
                html: {
                    end_with_newline: true,
                    indent_size: 4,
                    indent_with_tabs: true,
                    indent_inner_html: true,
                    preserve_newlines: true,
                    unformatted: unformatted
                }
            },
            replace: [ ' type="text/javascript"' ]
        }))
    ]
});

module.exports = new Promise((resolve, reject) => {
    resolve(buildWebpackConfig);
});