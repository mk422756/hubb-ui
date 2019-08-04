require('dotenv').config()

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Hubb',
    titleTemplate: `%s | ${process.env.META_TITLE}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.META_DESCRIPTION
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: process.env.META_TITLE
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: process.env.HOST_NAME },
      { hid: 'og:image:width', property: 'og:image:width', content: 1200 },
      { hid: 'og:image:height', property: 'og:image:height', content: 630 },
      {
        hid: 'og:title',
        property: 'og:title',
        content: process.env.META_TITLE
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: process.env.META_DESCRIPTION
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: process.env.META_SITE_IMAGE
      },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: process.env.META_TITLE },
      { name: 'twitter:image', content: process.env.META_SITE_IMAGE },
      {
        name: 'twitter:description',
        content: process.env.META_DESCRIPTION
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    { src: '~assets/css/bulma.scss', lang: 'scss' }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/firebase' },
    { src: '~plugins/auth' },
    { src: '~plugins/dayjs' },
    { src: '~plugins/fontawesome' },
    { src: '~plugins/sanitize' },
    { src: '~plugins/crop', mode: 'client' },
    { src: '~plugins/validate', mode: 'client' }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/apollo',
    '@nuxtjs/dotenv',
    '@nuxtjs/toast',
    ['@nuxtjs/google-analytics', { id: process.env.GOOGLEANALYTICS_ID }]
  ],

  toast: {
    duration: 2000
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.HTTP_ENDPOINT
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
