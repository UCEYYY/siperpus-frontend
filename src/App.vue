<template>
  <div id="app">
    <!-- Modern Navbar Header -->
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo & Brand -->
          <button 
            @click="goHome" 
            class="flex items-center gap-2 font-bold text-xl text-foreground hover:opacity-70 transition-opacity cursor-pointer rounded px-2 py-1 hover:bg-accent/10 border-0 bg-transparent"
          >
            <span class="text-2xl">📚</span>
            <span class="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">SiPerpus</span>
          </button>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :exact="item.exact"
              active-class="bg-accent text-accent-foreground"
              class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </RouterLink>
          </nav>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center gap-2">
            <ThemeSwitcher />
            <Button variant="ghost" size="icon" as-child>
              <RouterLink to="/login">
                <LogIn class="h-4 w-4" />
              </RouterLink>
            </Button>
            <Button size="sm" as-child>
              <RouterLink to="/register">
                <UserPlus class="mr-2 h-4 w-4" />
                Daftar
              </RouterLink>
            </Button>
          </div>

          <!-- Mobile Menu Toggle -->
          <Button variant="ghost" size="icon" class="md:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
            <X v-else class="h-5 w-5" />
          </Button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden border-t border-border bg-background">
        <nav class="container mx-auto px-4 py-4 space-y-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :exact="item.exact"
            active-class="bg-accent text-accent-foreground"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-accent/50"
            @click="isMobileMenuOpen = false"
          >
            <component :is="item.icon" class="h-5 w-5" />
            {{ item.label }}
          </RouterLink>

          <Separator class="my-2" />

          <div class="space-y-2 pt-2">
            <Button variant="outline" class="w-full" as-child>
              <RouterLink to="/login">
                <LogIn class="mr-2 h-4 w-4" /> Masuk
              </RouterLink>
            </Button>
            <Button class="w-full" as-child>
              <RouterLink to="/register">
                <UserPlus class="mr-2 h-4 w-4" /> Daftar
              </RouterLink>
            </Button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'
import { Home, BookOpen, LogIn, UserPlus, Menu, X } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const goHome = async () => {
  if (route.path !== '/') {
    await router.push({ path: '/' })
  }
}

const navItems = [
  { path: '/', label: 'Beranda', icon: Home, exact: true },
  { path: '/katalog', label: 'Katalog', icon: BookOpen, exact: false },
]
</script>

<style>
/* Global styles untuk app layout */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>