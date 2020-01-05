var path = require('path');
var CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: "./index.js",
    output: {
      filename: "index.js"
    },
    plugins: [
      new CopyPlugin([
        { from: 'dist', to: "../production" },
      ]),
      new CopyPlugin([
        { from: 'V1', to: 'V1' },
        { from: 'allApp', to: 'allApp' },
        { from: 'src', to: 'src' },
      ])
    ],
    mode: "development",
    devServer: {
      // contentBase: './production',
      contentBase: path.join(__dirname, 'production'),
      compress: true,
      port: 2121,
      allowedHosts: [
        // 'host.com',
        // 'subdomain.host.com',
        // 'subdomain2.host.com',
        // 'host2.com'
      ]
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          loader: 'css-loader',
          options: {
            url: true,
          },
        },
        {
          test: /\.html$/,
          use: [ {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }],
        }
      ],
    },
  }