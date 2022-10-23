const { defineConfig } = require('@vue/cli-service')
const { domToCodePlugin, domToCodeDevServerV5 } = require('dom-to-code/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    ...domToCodeDevServerV5,
  },
  chainWebpack: (config) => {
    // add plugin at first
    config.plugin('dom-to-code').use(domToCodePlugin())
  },
})
