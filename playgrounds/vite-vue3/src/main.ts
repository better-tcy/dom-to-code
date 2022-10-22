import { initDomToCode } from 'dom-to-code/client'
import { createApp } from 'vue'
import App from './App.vue'

// css
import 'uno.css'
import '@unocss/reset/tailwind.css'

initDomToCode()

const app = createApp(App)
app.mount('#app')

app.config.globalProperties.productionTip = false
