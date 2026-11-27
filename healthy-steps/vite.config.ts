import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import { siteConfig } from './src/config/site.config.ts';

const kebab = (text: string): string => text.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Fills the HTML pages from src/config/site.config.ts so the name,
 * description, and brand colors are only ever edited in one place.
 * Social sharing tags are added only when VITE_SITE_URL holds the real,
 * verified address of the deployed site.
 */
function siteHtml(siteUrl: string): Plugin {
  const cssVariables = Object.entries(siteConfig.colors)
    .map(([key, value]) => `--brand-${kebab(key)}:${value}`)
    .join(';');

  return {
    name: 'healthy-steps-site-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const isPrivacy = context.path.endsWith('privacy.html');
        const title = isPrivacy
          ? `Privacy notice | ${siteConfig.name}`
          : `${siteConfig.name} | Prediabetes awareness events and volunteering`;
        const description = isPrivacy
          ? `How ${siteConfig.name} handles information sent through the volunteer request form.`
          : siteConfig.description;

        const tags: HtmlTagDescriptor[] = [
          { tag: 'style', attrs: { id: 'brand-colors' }, children: `:root{${cssVariables}}`, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'theme-color', content: siteConfig.colors.teal }, injectTo: 'head' },
        ];

        if (siteUrl) {
          const base = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
          const pageUrl = isPrivacy ? `${base}privacy.html` : base;
          tags.push(
            { tag: 'link', attrs: { rel: 'canonical', href: pageUrl }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:site_name', content: siteConfig.name }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:description', content: description }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:url', content: pageUrl }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' }, injectTo: 'head' },
          );
        }

        return {
          html: html
            .replaceAll('{{title}}', escapeHtml(title))
            .replaceAll('{{description}}', escapeHtml(description))
            .replaceAll('{{siteName}}', escapeHtml(siteConfig.name)),
          tags,
        };
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Where the site is served from. "./" (relative) works at any address,
    // including https://USERNAME.github.io/REPOSITORY/. The deploy workflow
    // sets SITE_BASE_PATH explicitly. See README, "Base path".
    base: env.SITE_BASE_PATH || './',
    plugins: [react(), tailwindcss(), siteHtml(env.VITE_SITE_URL ?? '')],
    build: {
      outDir: 'dist',
      rolldownOptions: {
        // Two real static pages. No client-side routing to break on refresh.
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          privacy: resolve(import.meta.dirname, 'privacy.html'),
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      env: { TZ: 'UTC' },
    },
  };
});
