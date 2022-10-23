const { domToCodePlugin, domToCodeDevServerV4 } = require('dom-to-code/webpack')

module.exports = {
  devServer: {
    ...domToCodeDevServerV4,
  },
  chainWebpack: (config) => {
    // add plugin at first
    config.plugin('dom-to-code').use(domToCodePlugin())
  },
}
