export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
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
    { src: '~/plugins/fontawesome' },
    { src: '~/plugins/sanitize' },
    { src: '~/plugins/crop', mode: 'client' },
    { src: '~/plugins/validate', mode: 'client' }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/apollo',
    '@nuxtjs/dotenv',
    '@nuxtjs/toast'
  ],

  toast: {
    duration: 2000
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'https://hubb-lsg4r7sosa-an.a.run.app/query'
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
