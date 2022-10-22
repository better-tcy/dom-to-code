import React from 'react'
import ReactDOM from 'react-dom'
import { initDomToCode } from 'dom-to-code/client'
import Example from './Example'

import '@unocss/reset/tailwind.css'
import 'uno.css'

initDomToCode()

ReactDOM.render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>,
  document.querySelector('#app'),
)
