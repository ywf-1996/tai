

const path = require('path')


module.exports = {
    
    mode: 'production',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash:6].js'
    }

}

