// @ts-check
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://frizim.com',
  output: "static",
  trailingSlash: "ignore",
  integrations: [mdx(), sitemap()],
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
  }),

  env: {
    schema: {
      COMMIT_HASH: envField.string({
        optional: true,
        default: "1.2.0",
        context: "server",
        access: "public",
        min: 5,
        max: 10
      }),
      BUILD_DATE: envField.number({
        optional: true,
        default: Date.now(),
        context: "server",
        access: "public",
        gt: 0
      })
    }
  }
});