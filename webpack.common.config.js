const path = require('path');
const webpack = require( 'webpack' );

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    devtool: 'source-map',
    resolve: {
        extensions:['.ts', '.webpack.js', '.web.js', '.js', '.json' ]
    },
    module : {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                	configFile: `${__dirname}/tsconfig.node.json`
                }
            }
        ],
    },
    externals: [],
    plugins:[],
};
