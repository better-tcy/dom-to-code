<div align="center">
  <a href="https://dom-to-code.netlify.app/">
    <img src="https://raw.githubusercontent.com/better-tcy/dom-to-code/master/packages/doc/.vuepress/public/images/logo-bg.png" width="50%">
  </a>
  <div align="center">
    <h1>DOM TO CODE</h1>
    <a href="./README.md">简体中文</a> | <a>English</a>
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

## ✨ Introduce

When taking over a project to develop a webpage, you must modify a certain part, either searching for or finding the corresponding code by memory. The process is extremely wasteful.

After using the DOM-TO-Code plug-in in the project, the CTRL + Press the mouse wheel that wants to modify the DOM part you want to modify will open the corresponding DOM element source code in the editor.

(Users of mac touchpad can ctrl + touchpad right button)


Support Vite/Webpack + Vue2/Vue3/React

Support VSCode/Webstorm

Others searched for you to jump directly, and you can touch the fish overtime.

<img src="https://raw.githubusercontent.com/better-tcy/dom-to-code/master/packages/doc/.vuepress/public/images/dom-to-code-example.gif">

## 📦 installation

```bash
npm i dom-to-code
```

## Use

#### Configuration option

```ts
interface Options {
  /**
   * Plugin mode, the default is vue
   */
  mode: 'vue' | 'react'

  /**
   * Introduced file rules, VUE's default is JSX, TSX, Vue files, and react is JSX, TSX files by default
   */
  include?: string | RegExp | string[] | RegExp[] | null

  /**
   * The exclusive file rules, the default is node_modules file
   */
  exclude?: string | RegExp | string[] | RegExp[] | null
}

```

#### first step

First of all`index`File or`main`File) Introduction of plug -in initialization

```ts
import { initDomToCode } from 'dom-to-code'

// Initialize Dom-TO-Code
// initDomToCode()

// Recommended: Only initialize in the non-production environment
process.env.NODE_ENV !== 'production' && initDomToCode()
```

#### Step 2

Configure the package,`dom-to-code`support`vite`and`webpack`The packager, the following is`vite`As well as`vue-cli`As well as`webpack`Examples (Recommended only in non-production environment configuration)

<details>
<summary>Vite</summary><br></details>

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue3 from '@vitejs/plugin-vue'
import { domToCodePlugin } from 'dom-to-code/vite'

export default defineConfig({
  plugins: [
    vue3(),
    domToCodePlugin({
      mode: 'vue'
    })
  ]
})
```

Example:[`playgrounds/vite-vue3`](./playgrounds/vite-vue3/)

<br>

<details>
<summary>Webpack</summary><br></details>

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

<br>

<details>
<summary>Vue cli</summary><br></details>

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

<br>

<details>
<summary>Create-React-APP + React-APP-Rewired</summary><br></details>

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

      // If the React-Scripts version in your Package.json <= 4.x.x, use domToCodeDevServerV4
      // Object.assign(config, domToCodeDevServerV4)

      // If the React-Scripts version in your Package.json> = 5.x.x, use domToCodeDevServerV5
      Object.assign(config, domToCodeDevServerV5)

      return config
    }
  },
}
```

Example:[`playgrounds/webpack5-react`](./playgrounds/webpack5-react/)

<br>

## 📚 documentation

Check [Document Guide 📒](https://dom-to-code.netlify.app/) (coming soon ...)

## Pay attention

If you can't jump the editor, make sure your editor has added to the environment variable, such as vSCode, after successful adding, enter the command terminal input

```bash
code -v
```

You can see the VSCode version information means success.

## 🤖️ CONTRIBUTING

Learn About Contribution[here](https://github.com/better-tcy/dom-to-code/blob/master/CONTRIBUTING.md)Then, then, then

This project exist that all the people who control:

<a href="https://github.com/better-tcy/dom-to-code/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=better-tcy/dom-to-code">
</a>

## 📄 License

[Mit](https://github.com/better-tcy/dom-to-code/blob/master/LICENSE)License 2 2022-PRESENT[tuocangyu](https://github.com/better-tcy)
