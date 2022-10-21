import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
  '/guide/': [
    {
      text: '指南',
      children: ['/guide/README.md', '/guide/questions.md'],
    },
  ],
  '/libs/dom-to-code/': [
    {
      text: 'dom-to-code',
      children: [
        '/libs/dom-to-code/README.md',
        '/libs/dom-to-code/example.md',
      ],
    },
  ],
}
