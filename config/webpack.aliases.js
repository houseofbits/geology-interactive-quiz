const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '/bootstrap': path.resolve(__dirname, '../node_modules/bootstrap/scss'),
            '@js': path.resolve(__dirname, '../app/js'),
            '@images': path.resolve(__dirname, '../app/images'),
            '@json': path.resolve(__dirname, '../app/json'),
        }
    }
};