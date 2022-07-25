const path = require('path');

module.exports = {
    entry: {
        'main': './app/js/main.js',
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, '../dist/'),
    },
};