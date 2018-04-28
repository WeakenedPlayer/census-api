const commonConfig = require('./webpack.common.config.js');
const merge = require('webpack-merge');

module.exports = merge( commonConfig, {
    target: 'node',
    output : {
        path: `${__dirname}/dist/node`,
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false,
    }
} );
