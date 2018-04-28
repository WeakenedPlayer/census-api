const commonConfig = require('./webpack.common.config.js');
const merge = require('webpack-merge');

module.exports = merge( commonConfig, {
    target: 'web',
    output : {
        path: `${__dirname}/dist/web`,
        filename: '[name].js'
    },
} );
