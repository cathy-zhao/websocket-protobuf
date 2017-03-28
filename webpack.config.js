var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {

    entry: {
        'client': './views/client.jsx'
    },

    output: {
        path: './dist/scripts',
        filename: '[name].js',
    },

    module: {
        loaders: [
            {test: /\.jsx?$/,    exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.(less)$/, exclude: /node_modules/,  loader: "style-loader!css-loader!less-loader"},
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    }
};
