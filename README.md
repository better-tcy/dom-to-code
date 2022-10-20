## 背景
**大多数中大型项目并不是一两个前端去开发的，可能有些不是你编写的业务你都不知道源码在哪里,并且随着项目迭代越来越多，组件不断增加，如果给你个新需求或者再原来基础上改bug，想快速定位到某个文件或某条代码 要么问同事 要么全局搜，其实这并不是一件特别高效的方法,安装这个插件 可以让你通过浏览器dom直接到源代码，是不是方便很多 :tw-1f428:**
## 安装
**npm install dom-to-code**
## 使用
**1.vue.config.js**
```javascript
const server = require('dom-to-code/lib/server')

module.exports = {
  devServer: {
  before: server
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .test(/\.vue/)
      .use('dom-to-code/lib/add-location-loader.js')
      .loader('dom-to-code/lib/add-location-loader.js')
      .end()
  }
}
```
**2.main.js**
```javascript
import client from 'dom-to-code'

client()
```
**3.在浏览器Dom上Ctrl | Command + 鼠标滚轮点击即可定位到源码行**

**注：为了正确跳转到对应代码行，我们确保vscode命令已经添加到环境变量中。Mac系统用户可以在VSCode界面使用command+shift+p快捷键，然后搜索Code 并选择install 'code' command in path；Windows用户可以找到VSCode安装位置的bin文件夹目录，并将该目录路径添加到系统环境变量当中。**
