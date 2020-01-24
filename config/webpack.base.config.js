const path = require("path");
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PATHS = {
    src: path.join(__dirname, "../src"),
    dist: path.join(__dirname, "../dist"),
    assets: "assets/"
};

const TEMPLATES_DIR = `${PATHS.src}/pug/pages/`;
const TEMPLATES = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.pug'));

module.exports = {
    externals: {
        paths: PATHS,
        templates_dir: TEMPLATES_DIR,
        templates: TEMPLATES
    },
    entry: {
        app: PATHS.src,
        about: `${PATHS.src}/js/about.js`
    },
    output: {
        filename: `${PATHS.assets}js/[name].js`,
        path: PATHS.dist,
        publicPath: "/"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                // html / pug
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }                
            },
            {
                // JavaScript
                test: /\.js$/,
                loader: "babel-loader",
                exclude: "/node_modules/"
            },
            {
                // scss
                test: /\.scss$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: { sourceMap: true }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            config: { path: `./postcss.config.js` }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: { sourceMap: true }
                    }
                ]
            },
            {
                // Fonts
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]"
                }
            },
            {
                // images / icons
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                name: "[name].[ext]"
                }
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].css`
        }),
        new CopyWebpackPlugin([
            { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
            { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
            { from: `${PATHS.src}/static`, to: `${PATHS.dist}` }
        ])
    ]
};
