import { defineClientConfig } from '@vuepress/client'
import type { ConcreteComponent, DefineComponent } from 'vue'
import { h, resolveComponent } from 'vue'
import * as base64 from 'js-base64'
import type { CodeDemoProps } from './CodeDemo.props'

export default defineClientConfig({
  async enhance({ app }) {
    let CodeDemo: DefineComponent<{}, {}, any> | undefined

    if (!__VUEPRESS_SSR__) {
      CodeDemo = (await import('./CodeDemo.vue')).default

      // set global css
      const styleEl = document.createElement('style')
      styleEl.innerHTML = `
      .code-demo-wrapper {
        margin-top: 1rem;
        margin-bottom: 1rem;
      }
      .code-demo-wrapper + .code-demo-wrapper {
        margin-top: 3rem;
      }
    `
      document.head.append(styleEl)
    }
    if (CodeDemo)
      app.component('CodeDemo', CodeDemo)

    // wrap the component with default options
    app.component('CodeDemoClient', (defaultProps: CodeDemoProps) => {
      if (!CodeDemo)
        return null
      const ClientOnly = resolveComponent('ClientOnly')

      const codeDemoOptions = self.loadCodeDemoOptions?.(defaultProps) ?? defaultProps

      return h(ClientOnly, {}, () =>
        h(CodeDemo as ConcreteComponent, {
          ...codeDemoOptions,
        }),
      )
    })

    app.config.globalProperties.base64 = base64 // decode the options in sandbox component
  },
})
