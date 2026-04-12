// src/router/index.js 
import { createRouter, createWebHistory } from 'vue-router' 
  
const router = createRouter({ 
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes: [ 
    { 
      path: '/', 
      name: 'home', 
      // Lazy loading — komponen dimuat saat halaman pertama dikunjungi 
      component: () => import('../views/HomeView.vue'), 
      meta: { title: 'Beranda — SiPerpus' } 
    }, 
    // Route-route lain ditambahkan di Bab 4 (Routing & State Management) 
  ], 
}) 
  
export default router