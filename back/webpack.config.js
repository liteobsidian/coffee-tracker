const path = require('path')
const webpack = require('webpack')
// const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
// const nodeExternals = require('webpack-node-externals')

module.exports = {
  // mode: 'production',
  entry: [
    'regenerator-runtime/runtime',
    './index.js'
  ],
  target: 'node',
  node: {
    __dirname: false
  },
  // devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'stat.bundle.js'
  },
  resolve: {
    alias: {
      'pg-native': path.resolve(__dirname, 'dummy.js'),
      '@root': path.resolve(__dirname, '/'),
      '@config': path.resolve(__dirname, 'src/config.js'),
      '@db': path.resolve(__dirname, 'src/db.js'),
      '@log': path.resolve(__dirname, 'src/logger.js'),
      '@lib': path.resolve(__dirname, 'src/lib/'),
      '@api': path.resolve(__dirname, 'src/api/v1.0/'),
      '@auth-check': path.resolve(__dirname, 'src/auth-check/')
    }
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        exclude: /(node_modules)/,
        test: /\.js$/
      },
      {
        test: /\.html/,
        loader: 'raw-loader'
      },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './template', to: 'template' }
      ]
    })
    // new CopyPlugin([
    //   { from: './public', to: 'public' },
    //   { from: './uploads', to: 'uploads' }
    // ])
  ]
  // externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  // externals: [nodeExternals()] // in order to ignore all modules in node_modules folder
  // externals: { 'aws-sdk': 'aws-sdk', 'mock-aws-s3': 'mock-aws-s3', nock: 'nock' }
}
