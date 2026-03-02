// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module", "@sidebase/nuxt-auth", "nuxt-countdown"],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      // components: ["VCard", "VCardTitle", "VCardText", "VCardActions", "VBtn"],
      labComponents: true,
      /* vuetify options */
      directives: true,
      icons: {
        defaultSet: "mdi",
      },
    },
  },
  // auth: {
  //   originEnvKey: "AUTH_ORIGIN",
  //   baseURL: process.env.AUTH_ORIGIN || "http://localhost:3000",
  //   provider: {
  //     type: "authjs",
  //   },
  // },
  auth: {
    provider: {
      type: "authjs", // or 'local', 'refresh'
    },
    // Do not set baseURL here if using AUTH_ORIGIN env var
  },
  runtimeConfig: {
    authOrigin: process.env.AUTH_ORIGIN,
    authBaseURL: process.env.AUTH_ORIGIN || "http://localhost:3000/api/auth",
    authSecret: process.env.AUTH_SECRET,
    authJs: {
      secret: process.env.AUTH_SECRET,
      origin: process.env.AUTH_ORIGIN || "http://localhost:3000/api/auth",
    },
    private: {
      mongodbUri: process.env.MONGODB_URI,
    },
  },
});
