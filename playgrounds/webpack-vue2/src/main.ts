import Vue from 'vue'
import App from './App.vue'
import {initDomToCode} from 'dom-to-code/client'

initDomToCode()


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
