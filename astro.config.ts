// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import alpinejs from '@astrojs/alpinejs';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://frizim.com',
  output: "static",
  trailingSlash: "ignore",
  integrations: [mdx(), sitemap(), alpinejs()],
  scopedStyleStrategy: "class",

  build: {
      inlineStylesheets: "never",
      assets: "static"
  },

  security: {
    checkOrigin: false
  },

  server: {
      port: 8080
  },

  adapter: node({
    mode: 'middleware'
  })
});