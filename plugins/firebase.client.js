import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'


export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
    databaseURL: config.public.firebaseDatabaseUrl
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  

  return {
    provide: {
      database
    }
  };
});