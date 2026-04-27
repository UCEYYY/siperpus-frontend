<template>
  <!-- State: Loading -->
  <div v-if="isLoading" :class="['grid gap-4', gridClass]">
    <Skeleton v-for="i in 4" :key="i" class="h-[320px] w-full rounded-xl" />
  </div>

  <!-- State: Empty -->
  <div v-else-if="items.length === 0">
    <slot name="empty" />
  </div>

  <!-- State: Data Ready -->
  <div v-else :class="['grid gap-4', gridClass]">
    <slot 
      v-for="item in items" 
      :key="item.id" 
      name="default" 
      :item="item" 
    />
  </div>
</template>

<script setup>
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps({
  items: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
  gridClass: { type: String, default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }
})
</script>