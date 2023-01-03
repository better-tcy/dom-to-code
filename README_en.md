<div align="center">
  <a href="https://dom-to-code.netlify.app/">
    <img src="https://raw.githubusercontent.com/better-tcy/dom-to-code/master/packages/doc/.vuepress/public/images/logo-bg.png" width="50%">
  </a>
  <div align="center">
    <h1>DOM TO CODE</h1>
    <p> <a href="./README.md">简体中文</a> | English</p>
    <p>Develop an efficient artifact, click DOM to jump directly to the editor's corresponding code.</p>
    <p>Support Vite/Webpack + Vue2/Vue3/React + VScode/Webstorm</p>
  </div>
  <p>
    <a href="https://www.npmjs.com/package/dom-to-code"><img src="https://img.shields.io/npm/v/dom-to-code.svg" alt="npm package"></a>
    <a href="#badge"><img src="https://img.shields.io/github/languages/top/better-tcy/dom-to-code" alt="language"></a>
    <a href="https://img.badgesize.io/https:/unpkg.com/dom-to-code/dist/?label=gzip%20size&#x26;compression=gzip"><img src="https://img.badgesize.io/https:/unpkg.com/dom-to-code/dist/?label=gzip%20size&#x26;compression=gzip" alt="gzip"></a>
    <a href="#badge"><img src="https://img.shields.io/librariesio/github/better-tcy/dom-to-code" alt="librariesio"></a>
    <a href="https://github.com/better-tcy/dom-to-code/blob/master/LICENSE"><img src="https://img.shields.io/github/license/better-tcy/dom-to-code" alt="LICENSE"></a>
    <img src="https://img.shields.io/github/stars/better-tcy/dom-to-code?style=social" alt="stars">
  </p>
</div>

## ✨ Introduction
When taking over a project to develop a webpage, if you want to modify a certain part, you can either search or find the corresponding code by memory. The process is extremely wasteful.

After using the `dom-to-code` plugin in the project, the CTRL + Press the mouse wheel that wants to modify the DOM part you want to modify will open the corresponding DOM element source code in the editor.

(Users of mac touchpad can ctrl + touchpad right button)

Support vite/webpack + vue2/vue3/react

Support vscode/webstorm

Others searched for you to jump directly, and you can touch the fish overtime.

<img src="https://raw.githubusercontent.com/better-tcy/dom-to-code/master/packages/doc/.vuepress/public/images/dom-to-code-example.gif">

## 📦 Install

```bash
npm i dom-to-code
```

## 🔨 Usage

#### Configuration option

```ts
interface Options {
  /**
   * Plugin mode, the default is vue
   */
  mode: 'vue' | 'react'

  /**
   * Include file rules, vue's default is JSX, TSX, Vue files, and react is JSX, TSX files by default
   */
  include?: string | RegExp | string[] | RegExp[] | null

  /**
   * The exclude file rules, the default is node_modules file
   */
  exclude?: string | RegExp | string[] | RegExp[] | null
}

```

#### Step 1

First of all, import the plugin initialization in the project entry file (such as `index` file or `main` file)

```ts
import { initDomToCode } from 'dom-to-code'

// Initialize Dom-TO-Code
// initDomToCode()

// Recommended: Only initialize in the non-production environment
process.env.NODE_ENV !== 'production' && initDomToCode()
```

#### Step 2

Configure the package, `dom-to-code` support `vite` and `webpack` The packager, the following is `vite` and `vue-cli` and `webpack` Examples (Recommended only in non-production environment configuration)

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue3 from '@vitejs/plugin-vue'
import { domToCodePlugin } from 'dom-to-code/vite'

export default defineConfig({
  plugins: [
    vue3(),
    process.env.NODE_ENV !== 'production'
      ? domToCodePlugin({
          mode: 'vue',
        })
      : undefined,
  ].filter((f) => !!f)
})
```

Example:[`playgrounds/vite-vue3`](./playgrounds/vite-vue3/)

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const { domToCodePlugin } = require('dom-to-code/webpack')
module.exports = {
  /* ... */
  plugins: [
    domToCodePlugin({
      mode: 'vue'
    })
  ]
}
```

<br></details>

<details>
<summary>Vue cli</summary><br>

```ts
// vue.config.js
const { domToCodePlugin, domToCodeDevServerV4, domToCodeDevServerV5 } = require('dom-to-code/webpack')

module.exports = {
  devServer: {
    // If @vue/cli-server version in your package.json <= 4.x.x, use domToCodeDevServerV4
    // ...domToCodeDevServerV4,

    // If @vue/cli-server version in your package.json> = 5.x.x, use domToCodeDevServerV5
    ...domToCodeDevServerV5
  },
  configureWebpack: {
    plugins: [
      domToCodePlugin({
        mode: 'vue'
      })
    ]
  }
  // If you are using chainWebpack
  // chainWebpack: (config) => {
  //   config
  //     .plugin('domToCodePlugin')
  //     .use(domToCodePlugin())
  // }
}
```

Example:[`playgrounds/webpack5-vue2`](./playgrounds/webpack5-vue2/)

<br></details>

<details>
<summary>Create-React-APP + React-APP-Rewired</summary><br>

```ts
// config-overrides.js
const { domToCodePlugin, domToCodeDevServerV4, domToCodeDevServerV5 } = require('dom-to-code/webpack')

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

      // If the react-scripts version in your package.json <= 4.x.x, use domToCodeDevServerV4
      // Object.assign(config, domToCodeDevServerV4)

      // If the react-scripts version in your package.json> = 5.x.x, use domToCodeDevServerV5
      Object.assign(config, domToCodeDevServerV5)

      return config
    }
  },
}
```

Example:[`playgrounds/webpack5-react`](./playgrounds/webpack5-react/)

<br></details>

## 📚 Document

Check [Document Guide 📒](https://dom-to-code.netlify.app/) (coming soon ...)

## 💡 Notice

If you can't jump the editor, make sure your editor has added to the environment variable, such as VSCode, after successful adding, enter the command terminal input

```bash
code -v
```

You can see the VSCode version information means success.

## 🤖️ Contributing

Learn About Contribution [here](https://github.com/better-tcy/dom-to-code/blob/master/CONTRIBUTING.md) 

This project exist that all the people who control:

<a href="https://github.com/better-tcy/dom-to-code/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=better-tcy/dom-to-code">
</a>

## 📄 License

[MIT](https://github.com/better-tcy/dom-to-code/blob/master/LICENSE) License 2 2022-PRESENT[tuocangyu](https://github.com/better-tcy)
