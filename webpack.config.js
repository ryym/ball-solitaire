const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',

  entry: SRC,

  output: {
    path: path.join(ROOT, 'dist'),
    filename: '[name]-[chunkhash].js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  devServer: {
    port: '8000',
  },

  module: {
    rules: [
      {
        test: /\.tsx?/,
        include: SRC,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
