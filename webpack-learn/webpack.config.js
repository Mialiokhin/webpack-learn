const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: false}
          }
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          "style-loader",// creates styles nodes from JS strings
          "css-loader",// translates CSS into CommonJS
          "sass-loader",// compiles Sass to CSS
          {
            loader: "sass-resources-loader",
            options: {
              resources: [
                'src/styles/index.scss',
              ]
            }
          },
        ]
      }]
  },
  entry: './src/app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/public/index.html',
      filename: './index.html'
    })
  ],
  devServer: {
    compress: true,
    port: 3000,
  },
};