import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate' // 1. Import

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia() // 2. Create the instance

pinia.use(piniaPluginPersistedState) // 3. Use the plugin

app.use(pinia) // 4. Use the configured pinia
app.use(router)

app.mount('#app')