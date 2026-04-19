// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Bab 1 ──────────────────────────────────────────────────
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Beranda' }
    },

    // ── Bab 2 ──────────────────────────────────────────────────
    {
      path: '/katalog',
      name: 'katalog',
      component: () => import('../views/KatalogView.vue'),
      meta: { title: 'Katalog Buku' }
    },
    {
      path: '/buku/tambah',
      name: 'form-buku',
      component: () => import('../views/FormBukuView.vue'),
      meta: { title: 'Tambah Buku' }
    },

    // ── Bab 4 — placeholder, akan diisi di Bab 4 ───────────────
    // { path: '/katalog/:id',          name: 'detail-buku',       ... }
    // { path: '/login',                name: 'login',             ... }
    // { path: '/dashboard',            name: 'dashboard',         ... }
    // { path: '/dashboard/buku',       name: 'kelola-buku',       ... }
    // { path: '/dashboard/anggota',    name: 'kelola-anggota',    ... }
    // { path: '/dashboard/peminjaman', name: 'kelola-peminjaman', ... }
    // { path: '/profil/riwayat',       name: 'riwayat',           ... }
  ],
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

// Update <title> halaman otomatis setiap navigasi
router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — SiPerpus`
    : 'SiPerpus'
})

export default router