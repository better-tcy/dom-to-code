import { initDomToCode } from 'dom-to-code/client'
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'

// css
import 'uno.css'
import '@unocss/reset/tailwind.css'

initDomToCode()

Vue.use(VueCompositionAPI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
