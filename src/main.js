import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css' // ✅ Wajib: Mengaktifkan Tailwind v4 & CSS Variables

const app = createApp(App)
app.use(router)
app.mount('#app')