import Vue from 'vue'
import { initDomToCode } from 'dom-to-code'
import App from './App.vue'

initDomToCode()

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
