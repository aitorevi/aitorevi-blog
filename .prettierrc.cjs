/**
 * Prettier config for aitorevi-blog.
 * `prettier-plugin-tailwindcss` debe ir SIEMPRE en último lugar
 * para que ordene clases tras la pasada del resto de plugins.
 */
module.exports = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
