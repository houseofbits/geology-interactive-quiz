const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif|obj)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: '/assets/images',
                        outputPath: 'images/'
                    }
                }]
            },
            {
                test: /\.obj$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: '/assets/objects',
                        outputPath: 'objects/'
                    }
                }]
            },
            {
                test: /\.(frag|vert)$/i,
                use: 'raw-loader',
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.s(a|c)ss$/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: 'fonts',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ],
    },
};