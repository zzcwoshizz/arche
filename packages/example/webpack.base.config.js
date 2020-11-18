/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');

function createWebpack(ENV, context) {
  const isProd = ENV === 'production';
  const hasPublic = fs.existsSync(path.join(context, 'public'));
  const plugins = hasPublic ? [new CopyWebpackPlugin({ patterns: [{ from: 'public' }] })] : [];

  !isProd &&
    plugins.push(
      new WebpackPluginServe({
        hmr: false, // switch off, Chrome WASM memory leak
        liveReload: false, // explict off, overrides hmr
        port: 3000,
        progress: false, // since we have hmr off, disable
        static: path.join(process.cwd(), '/build')
      })
    );

  return {
    context,
    entry: ['@babel/polyfill', './src/index.tsx'],
    mode: ENV,
    module: {
      rules: [
        {
          exclude: /(node_modules)/,
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1
              }
            }
          ]
        },
        {
          include: /node_modules/,
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
            require.resolve('css-loader')
          ]
        },
        {
          exclude: /(node_modules)/,
          test: /\.(js|ts|tsx)$/,
          use: [
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: require('./babel.config')
            }
          ]
        },
        {
          test: /\.md$/,
          use: [require.resolve('html-loader'), require.resolve('markdown-loader')]
        },
        {
          exclude: [/semantic-ui-css/],
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                esModule: false,
                limit: 10000,
                name: 'static/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        {
          exclude: [/semantic-ui-css/],
          test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                esModule: false,
                name: 'static/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        {
          include: [/semantic-ui-css/],
          test: [
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
            /\.eot$/,
            /\.ttf$/,
            /\.svg$/,
            /\.woff$/,
            /\.woff2$/
          ],
          use: [
            {
              loader: require.resolve('null-loader')
            }
          ]
        }
      ]
    },
    node: {
      child_process: 'empty',
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[hash:8].js',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      path: path.join(context, 'build'),
      publicPath: ''
    },
    performance: {
      hints: false
    },
    plugins: plugins
      .concat([
        new webpack.optimize.SplitChunksPlugin(),
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].css'
        })
      ])
      .filter((plugin) => plugin),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@arche-polkadot/abstract-wallet': path.resolve(__dirname, '../abstract-wallet/src'),
        '@arche-polkadot/extension-wallet': path.resolve(__dirname, '../extension-wallet/src'),
        '@arche-polkadot/types': path.resolve(__dirname, '../types/src')
      }
    },
    watch: !isProd,
    watchOptions: {
      ignored: ['.yarn', /build/, /node_modules/]
    }
  };
}

module.exports = createWebpack;
