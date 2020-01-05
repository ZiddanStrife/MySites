var path = require('path');
var CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: "./index.js",
    output: {
      filename: "index.js"
    },
    plugins: [
      new CopyPlugin([
        { from: 'V1', to: 'V1' },
        { from: 'app', to: 'app' },
        { from: 'src', to: 'src' },
      ]),
      new CopyPlugin([
        { from: 'dist', to: "../production" },
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
    }
  }