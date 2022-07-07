import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '274'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '881'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '5a5'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'b1f'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '9c2'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '5ac'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '7e5'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '626'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '89a'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '6a5'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', '70f'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', '55e'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', 'feb'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '5d6'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '139'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '6a8'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', 'a30'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', '8bb'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '7ff'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'c92'),
    routes: [
      {
        path: '/docs/Getting-started/installation',
        component: ComponentCreator('/docs/Getting-started/installation', '091'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Getting-started/overview',
        component: ComponentCreator('/docs/Getting-started/overview', 'e6b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Getting-started/quickstart',
        component: ComponentCreator('/docs/Getting-started/quickstart', '5ee'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Guides/compiling-contracts',
        component: ComponentCreator('/docs/Guides/compiling-contracts', '0ef'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Guides/project',
        component: ComponentCreator('/docs/Guides/project', '7ea'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Guides/testing',
        component: ComponentCreator('/docs/Guides/testing', '5db'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Guides/using-localenet',
        component: ComponentCreator('/docs/Guides/using-localenet', '9b0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Guides/writing-scripts',
        component: ComponentCreator('/docs/Guides/writing-scripts', '783'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intro',
        component: ComponentCreator('/docs/intro', 'aed'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '94f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
