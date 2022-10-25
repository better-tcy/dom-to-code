/**
 * dom 元素的 attr 值，用于存储 dom 元素对应的代码路径信息
 */
export const DOM_ATTR = 'data-path' as const

/**
 * 监听打开编辑器的请求路径名称
 */
export const OPEN_CODE_API = '/___open-code-editor' as const

/**
 * 支持的模式
 */
export const SUPPORT_MODE = ['vue', 'react'] as const

/**
 * js、ts、jsx、tsx
 */
export const REGEX_SRC_FILE = /\.[jt]sx?$/

/**
 * ts、tsx
 */
export const REGEX_TS_FILE = /\.tsx?$/

/**
 * jsx、tsx
 */
export const REGEX_JSX_FILE = /\.[jt]sx$/

/**
 * setup.js、setup.ts、setup.jsx、setup.tsx
 */
export const REGEX_SETUP_SFC = /\.setup\.[jt]sx?$/

/**
 * vue
 */
export const REGEX_VUE_SFC = /\.vue$/

