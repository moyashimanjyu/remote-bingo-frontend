export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Remote Bingo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Remote Bingo is an online bingo tool.You can enjoy real-time bingo games even at remote locations.' },
      { property: 'og:url', content: 'https://remote-bingo.com' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Remote Bingo' },
      { property: 'og:description', content: 'Remote Bingo is an online bingo tool.You can enjoy real-time bingo games even at remote locations.' },
      { property: 'og:site_name', content: 'Remote Bingo' },
      { property: 'og:image', content: 'https://remote-bingo.com/ogp.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Remote Bingo' },
      { name: 'twitter:image', content: 'https://remote-bingo.com/ogp.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css', integrity: 'sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk', crossorigin: 'anonymous' }
    ],
    script: [
      { 'src': 'https://www.googletagmanager.com/gtag/js?id=' + process.env.GOOGLE_ALALYTICS_ID, async: 'async' },
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/google-gtag',
    '@nuxtjs/dotenv',
    [
      'nuxt-i18n',
      {
        locales: [
          { code: 'ja', name: 'Japanese', iso: 'ja_JP', file: 'ja.json' },
          { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' }
        ],
        defaultLocale: 'en',
        langDir: 'locales/',
        strategy: 'prefix_and_default',
        vueI18n: {
          fallbackLocale: 'en'
        },
        vueI18nLoader: true,
        lazy: true
      }
    ]
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  ssr: false,

  axios: {
    proxy: true,
  },
  proxy: {
    '/functions': {
      target: process.env.FUNCTIONS_URL,
      pathRewrite: {'^/functions': '/'},
    }
  },
  'google-gtag': {
    id: process.env.GOOGLE_ALALYTICS_ID
  }
}
