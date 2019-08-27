

module.exports = {

    entry: {
        index: './src/script/tai.js'
    },

    module: {
        rules: [
            // 图片处理
            {
                test: /\.(png|jpe?g|gif|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[contenthash:8].[ext]',
                            outputPath: 'img',
                            limit: 1024
                        }
                    }
                ]
            }
        ]
    }

}