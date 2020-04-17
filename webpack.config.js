'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: "development",
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'project.bundle.js'
    },

    module: {
        rules: [
          {
            test: [ /\.vert$/, /\.frag$/ ],
            use: 'raw-loader'
          },
          {
            /* images */
            test: /\.(jpe?g|png|gif)$/,
            loader: 'file-loader',
            include: [ fontsPath, imagesPath, videosPath ],
            exclude: nm,
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })
    ]

};
