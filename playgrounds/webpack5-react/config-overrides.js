const { domToCodePlugin, domToCodeDevServerV5 } = require('dom-to-code/webpack')

// see: https://github.com/timarney/react-app-rewired
module.exports = {
  webpack(config) {
    config.plugins.push(domToCodePlugin({
      mode: 'react',
    }))
    return config
  },
  devServer(configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)

      Object.assign(config, domToCodeDevServerV5)

      return config
    }
  },
}
