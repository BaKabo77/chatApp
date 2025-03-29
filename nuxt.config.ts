// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css:['~/assets/style.css'],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  modules: [
    'vue-sonner/nuxt',
    '@pinia/nuxt',
    ['nuxt-auth-utils', {
      session: {
        expiryInSeconds: 3600
      }
    }],
    '@nuxtjs/cloudinary',
  ],
  nitro:{
    experimental:{
      websocket:true
    }
  },
  runtimeConfig: {
    // Variables accessibles côté serveur uniquement
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,

    // Variables publiques (accessibles côté client)
    public: {
      apiUrl: process.env.API_URL,
      // Configuration Firebase
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      firebaseDatabaseUrl:process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL
    }
  },

  // Assurez-vous que le plugin Firebase est chargé
  plugins: [
    '~/plugins/firebase.client.js'
  ],
})
