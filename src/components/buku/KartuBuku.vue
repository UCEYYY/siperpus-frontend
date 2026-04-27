<template>
  <Card class="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
    <CardHeader class="pb-3">
      <div class="flex justify-between items-start gap-2">
        <CardTitle class="line-clamp-2 text-lg font-semibold group-hover:text-primary transition-colors">
          {{ buku.judul }}
        </CardTitle>
        <Badge :variant="buku.tersedia ? 'default' : 'secondary'" class="shrink-0">
          {{ buku.tersedia ? 'Tersedia' : 'Dipinjam' }}
        </Badge>
      </div>
      <p class="text-sm text-muted-foreground mt-1">{{ buku.penulis }}</p>
    </CardHeader>
    
    <CardContent>
      <div class="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground mb-4">
        <span>{{ buku.kategori }}</span>
        <span>•</span>
        <span>{{ buku.penerbit }}</span>
        <span>•</span>
        <span>{{ buku.tahun }}</span>
      </div>
      
      <div class="flex gap-2">
        <Button variant="outline" class="flex-1" @click="$emit('lihat-detail', buku)">
          <Eye class="mr-2 h-4 w-4" />
          Detail
        </Button>
        <Button 
          :disabled="!buku.tersedia" 
          class="flex-1" 
          @click="$emit('pinjam', buku.id)"
        >
          <BookOpen class="mr-2 h-4 w-4" />
          Pinjam
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, BookOpen } from 'lucide-vue-next'

defineProps({
  buku: { type: Object, required: true }
})

defineEmits(['lihat-detail', 'pinjam'])
</script>