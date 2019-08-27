

const path = require('path')

const baseConfig = require('./webpack.config')

const WebpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')


module.exports = WebpackMerge(baseConfig, {
    
    mode: 'development',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:6].js'
    },

    devServer: {
        hot: true,
        open: true,
        host: '127.0.0.1',
        port: 10086,
        progress: true,
        contentBase: "src"
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    plugins: [
        
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
            filename: 'index.html'
        }),

        new Webpack.HotModuleReplacementPlugin()
    ]

})
