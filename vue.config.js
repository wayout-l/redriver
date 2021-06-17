const webpack = require("webpack");

module.exports = {
  publicPath: './',//重要，打包使用的
  //兼容性打包
  chainWebpack(config){
    config.entry('main').add('babel-polyfill')
  },
  //全局使用jquery
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  }
};